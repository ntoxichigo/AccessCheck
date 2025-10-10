import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../../../../lib/db/prisma";
import { log } from "../../../../../lib/logger";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      log.warn("Unauthorized export attempt", { scanId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user subscription
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser || (dbUser.subscription !== "pro" && dbUser.subscription !== "business")) {
      log.warn("Export attempted by non-pro user", { userId, subscription: dbUser?.subscription });
      return NextResponse.json(
        { error: "Export feature requires Pro or Business subscription" },
        { status: 403 }
      );
    }

    // Get scan
    const scan = await prisma.scan.findUnique({
      where: { id },
    });

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    // Verify ownership
    if (scan.userId !== userId) {
      log.warn("Unauthorized export attempt for scan", { userId, scanId: id, scanOwnerId: scan.userId });
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse scan results
    const results = typeof scan.results === "string" ? JSON.parse(scan.results) : scan.results;
    const violations = (results as { violations?: Record<string, unknown>[] })?.violations || [];

    // Format as JSON
    const exportData = {
      scan: {
        id: scan.id,
        url: scan.url,
        createdAt: scan.createdAt,
        status: scan.status,
        issuesFound: scan.issuesFound,
      },
      violations: violations.map((v: Record<string, unknown>) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        tags: v.tags,
        nodes: (v.nodes as Record<string, unknown>[])?.map((n: Record<string, unknown>) => ({
          html: n.html,
          target: n.target,
          failureSummary: n.failureSummary,
        })),
      })),
      summary: {
        total: violations.length,
        bySeverity: violations.reduce((acc: Record<string, number>, v: Record<string, unknown>) => {
          const impact = (v.impact as string) || "unknown";
          acc[impact] = (acc[impact] || 0) + 1;
          return acc;
        }, {}),
      },
    };

    log.info("Scan exported", { userId, scanId: id, format: "json" });

    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition": `attachment; filename="accessibility-scan-${scan.id}.json"`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    log.error("Export error", { error: error instanceof Error ? error : new Error(errorMessage) });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
