import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/db/prisma";
import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";
import type { Prisma } from "@prisma/client";
import { log } from '../../../lib/logger';
import { handleApiError } from '../../../lib/errors';

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
      });
      userTier = user?.subscription || "free";
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
      const total = await prisma.scan.count({ where: { userId } });
      if (total >= 5) {
        log.info('Free user scan limit reached', { userId });
        return NextResponse.json(
          { success: false, needsUpgrade: true, message: "You've used all 5 free scans. Upgrade to continue." },
          { status: 402 }
        );
      }
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });
    const results = await new AxePuppeteer(page).analyze();
    await browser.close();

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
