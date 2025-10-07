import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/db/prisma";
import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildTeaserSummary(results: any) {
  const violations = results?.violations || [];
  const counts: Record<string, number> = {};
  const sources: { id: string; impact?: string; help?: string }[] = [];
  for (const v of violations) {
    const impact = v.impact || "unknown";
    counts[impact] = (counts[impact] || 0) + 1;
    if (sources.length < 5) {
      sources.push({ id: v.id, impact: v.impact, help: v.help });
    }
  }
  return { severityCounts: counts, sources, hasMore: violations.length > sources.length };
}

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

function computeRiskFromViolations(violations: any[]) {
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
    if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

    // auth() requires Clerk middleware; fall back gracefully if unavailable
    let userId: string | null = null;
    try {
      const a = auth();
      // @ts-ignore – Clerk returns object with userId when middleware active
      userId = a?.userId ?? null;
    } catch {
      userId = null;
    }
    let userTier: string = "anon";
    if (userId) {
      // Ensure user exists; default to free tier on first contact
      const user = await prisma.user.upsert({
        where: { id: userId },
        create: { id: userId, email: userId, subscription: "free" },
        update: {},
      });
      userTier = user?.subscription || "free";
    }

    // Enforce limits
    // Anonymous users: allow a single teaser scan per browser (cookie-marked), then require auth
    if (!userId) {
      const cookieStore = await cookies();
      const used = cookieStore.get("anonScanUsed")?.value === "1";
      if (used) {
        return NextResponse.json(
          { success: false, needsAuth: true, message: "Sign in to run your free scan." },
          { status: 401 }
        );
      }
    } else if (userTier === "free") {
      // Free accounts: 1 scan total per account (lifetime)
      const total = await prisma.scan.count({ where: { userId } });
      if (total >= 1) {
        return NextResponse.json(
          { success: false, needsUpgrade: true, message: "Free plan scan used. Upgrade to continue." },
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

    // Save scan record if authenticated
    if (userId) {
      await prisma.scan.create({
        data: {
          url,
          userId,
          status: "completed",
          issuesFound: results?.violations?.length || 0,
          results: userTier === "free" ? {} : results,
        },
      });
    }

    // If anon or free, return teaser summary
    if (!userId || userTier === "free") {
      const summary = buildTeaserSummary(results);
      const risk = computeRiskFromCounts(summary.severityCounts);
      const response = NextResponse.json({ success: true, teaser: true, summary, risk });
      if (!userId) {
        // mark anon one-time use
        response.cookies.set({ name: "anonScanUsed", value: "1", path: "/", maxAge: 31556952, sameSite: "lax" }); // ~1 year
      }
      return response;
    }

    const risk = computeRiskFromViolations(results?.violations || []);
    return NextResponse.json({ success: true, results, risk });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}
