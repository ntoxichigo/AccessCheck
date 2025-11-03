import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/db/prisma";
import puppeteer from "puppeteer-core";
import type { Prisma } from "@prisma/client";
import { log } from '../../../lib/logger';
import { handleApiError } from '../../../lib/errors';
import { Resend } from 'resend';
import { generateScanCompletionEmail } from '../../../lib/email-templates';
import * as axeCore from 'axe-core';

function computeRiskFromCounts(counts: Record<string, number>) {
  const weights: Record<string, number> = { critical: 1.0, serious: 0.7, moderate: 0.4, minor: 0.2 };
  const weighted = Object.entries(counts).reduce((acc, [k, v]) => acc + (weights[k] || 0.1) * (v || 0), 0);
  const units = Math.max(1, Math.round(weighted));
  const usMaxPerIncident = 75000; // ADA Title III
  const euMinPerViolation = 50000; // varies by country
  const euMaxPerViolation = 250000;
  const usEstimate = Math.min(units * usMaxPerIncident, 300000);
  const euEstimateMin = Math.min(units * euMinPerViolation, 1000000);
  const euEstimateMax = Math.min(units * euMaxPerViolation, 2000000);
  return {
    standards: [
      "WCAG 2.1 (AA Level)",
      "ADA Title III (U.S.)",
      "European Accessibility Act 2025 (EU)",
      "EN 301 549 (EU web accessibility standard)",
    ],
    fines: {
      usUSD: usEstimate,
      euEUR: { min: euEstimateMin, max: euEstimateMax },
      note: "Estimates only. Not legal advice; varies by jurisdiction and case.",
    },
  };
}

function computeRiskFromViolations(violations: Array<{ impact?: string }>) {
  const counts: Record<string, number> = {};
  for (const v of violations || []) {
    const k = v?.impact || "unknown";
    counts[k] = (counts[k] || 0) + 1;
  }
  return computeRiskFromCounts(counts);
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      log.error('Scan request missing URL');
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // Get user ID from Clerk auth
    let userId: string | null = null;
    try {
      const user = await currentUser();
      userId = user?.id || null;
      log.info('Authentication check', { userId: userId ?? undefined, userExists: !!user });
    } catch (error) {
      // Not authenticated, will be treated as anonymous
      log.warn('Authentication failed', { error: error instanceof Error ? error : new Error(String(error)) });
      userId = null;
    }
    
    let userTier: string = "anon";
    if (userId) {
      const user = await prisma.user.upsert({
        where: { id: userId },
        create: { id: userId, email: userId || 'unknown', subscription: "free" },
        update: {},
        select: {
          subscription: true,
          trialStarted: true,
          trialEnds: true,
        },
      });
      
      // Check if trial is active
      const now = new Date();
      const isTrialActive = user.trialStarted && 
        user.trialEnds && 
        now >= user.trialStarted && 
        now <= user.trialEnds;
      
      userTier = isTrialActive ? 'trial' : (user?.subscription || "free");
    }

    // Enforce limits
    if (!userId) {
      const cookieStore = await cookies();
      const used = cookieStore.get("anonScanUsed")?.value === "1";
      log.info('Anonymous user check', { used, cookieValue: cookieStore.get("anonScanUsed")?.value });
      if (used) {
        log.info('Anonymous scan limit reached');
        return NextResponse.json(
          { success: false, needsAuth: true, message: "Sign in to run your free scan." },
          { status: 401 }
        );
      }
    } else if (userTier === "free") {
      // Free users: 1 scan per day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const scansToday = await prisma.scan.count({ 
        where: { 
          userId,
          createdAt: { gte: today }
        } 
      });
      
      if (scansToday >= 1) {
        log.info('Free user daily scan limit reached', { userId, scansToday });
        return NextResponse.json(
          { success: false, needsUpgrade: true, message: "You've used your daily scan. Upgrade to Pro for 10 scans/day." },
          { status: 402 }
        );
      }
    } else if (userTier === "pro" || userTier === "trial") {
      // Pro and Trial users: 10 scans per day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const scansToday = await prisma.scan.count({ 
        where: { 
          userId,
          createdAt: { gte: today }
        } 
      });
      
      if (scansToday >= 10) {
        log.info('Pro/Trial user daily scan limit reached', { userId, scansToday, tier: userTier });
        return NextResponse.json(
          { success: false, message: "You've used your 10 scans for today. Come back tomorrow!" },
          { status: 402 }
        );
      }
    }

    // Connect to Browserless.io for cloud Chromium
    const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;
    if (!BROWSERLESS_API_KEY) {
      throw new Error('BROWSERLESS_API_KEY not configured');
    }

    // Try the connect endpoint with proper format
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://production-sfo.browserless.io?token=${BROWSERLESS_API_KEY}`,
    });
    
    let page;
    let results;
    
    try {
      page = await browser.newPage();
      
      // Set a default viewport
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Increase timeout and use more lenient wait condition
      await page.goto(url, { 
        waitUntil: "networkidle2",
        timeout: 60000 // 60 seconds
      });
      
      // Ensure page is fully loaded and ready
      await page.waitForSelector('body', { timeout: 5000 });
      
      // Inject axe-core and run accessibility analysis manually
      await page.evaluate((axeSource: string) => {
        // Inject axe-core into the page
        const script = document.createElement('script');
        script.textContent = axeSource;
        document.head.appendChild(script);
      }, axeCore.source);
      
      // Run axe analysis
      results = await page.evaluate(() => {
        // @ts-ignore - axe is injected into the page
        return window.axe.run();
      });
      
      await browser.close();
    } catch (error) {
      await browser.close();
      throw error;
    }

    // Save full results for all scans
    const savedResults: Prisma.InputJsonValue = results as unknown as Prisma.InputJsonValue;
    // Save scan and capture ID for linking to report
    const createdScan = await prisma.scan.create({
      data: {
        url,
        userId,
        status: "completed",
        issuesFound: results?.violations?.length || 0,
        results: savedResults,
      },
    });
    log.info('Scan completed and results saved', { userId: userId ?? undefined, url, scanId: createdScan.id });

    // Send email notification if user is authenticated and has email preferences enabled
    if (userId && process.env.RESEND_API_KEY) {
      try {
        const user = await currentUser();
        const userSettings = await prisma.userSettings.findUnique({
          where: { userId },
          select: { emailPrefs: true },
        });

        if (userSettings?.emailPrefs !== false && user?.emailAddresses?.[0]?.emailAddress) {
          const resend = new Resend(process.env.RESEND_API_KEY);

          // Calculate violation counts by severity
          const violations = (results?.violations || []) as Array<{ impact?: string | null }>;
          const counts: Record<string, number> = violations.reduce((acc: Record<string, number>, v) => {
            const impact = v.impact || 'unknown';
            acc[impact] = (acc[impact] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          const reportUrl = `${baseUrl}/scan/${createdScan.id}`;

          const emailHtml = generateScanCompletionEmail({
            url,
            scanId: createdScan.id,
            violationsCount: violations.length,
            criticalCount: (counts.critical as number) || 0,
            seriousCount: (counts.serious as number) || 0,
            moderateCount: (counts.moderate as number) || 0,
            minorCount: (counts.minor as number) || 0,
            userName: user.firstName || user.username || undefined,
            reportUrl,
          });

          await resend.emails.send({
            from: 'AccessCheck <noreply@accesscheck.com>',
            to: user.emailAddresses[0].emailAddress,
            subject: `Scan Complete: ${violations.length} issue${violations.length !== 1 ? 's' : ''} found on ${url}`,
            html: emailHtml,
          });

          log.info('Email notification sent', { userId, scanId: createdScan.id });
        }
      } catch (emailError) {
        // Don't fail the scan if email fails
        log.error('Failed to send email notification', {
          error: emailError instanceof Error ? emailError : new Error(String(emailError)),
          userId,
          scanId: createdScan.id,
        });
      }
    }

    // Always return full results and risk for all users
    const risk = computeRiskFromViolations(results?.violations as Array<{ impact?: string }> || []);
  const response = NextResponse.json({ success: true, id: createdScan.id, results, risk });
    // Set anonymous scan cookie for unauthenticated users
    if (!userId) {
      response.cookies.set({ name: "anonScanUsed", value: "1", path: "/", maxAge: 31556952, sameSite: "lax" });
    }
    return response;
  } catch (error) {
    log.error('Scan error', { error: error instanceof Error ? error : new Error(String(error)) });
    return handleApiError(error);
  }
}
