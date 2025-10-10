import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../../../../../lib/db/prisma";
import { log } from "../../../../../../lib/logger";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      log.warn("Unauthorized CSV export attempt", { scanId: id });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user subscription
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser || (dbUser.subscription !== "pro" && dbUser.subscription !== "business")) {
      log.warn("CSV export attempted by non-pro user", { userId, subscription: dbUser?.subscription });
      return NextResponse.json(
        { error: "CSV export requires Pro or Business subscription" },
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
      log.warn("Unauthorized CSV export attempt for scan", { userId, scanId: id, scanOwnerId: scan.userId });
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse scan results
    const results = typeof scan.results === "string" ? JSON.parse(scan.results) : scan.results;
    const violations = (results as { violations?: Record<string, unknown>[] })?.violations || [];

    // Generate CSV
    const csvRows = [];
    
    // Header row
    csvRows.push([
      "ID",
      "Impact",
      "Description",
      "Help",
      "Help URL",
      "Tags",
      "Affected Elements",
      "HTML Snippet",
    ].map(escapeCSV).join(","));

    // Data rows
    for (const v of violations) {
      const violation = v as Record<string, unknown>;
      const nodes = (violation.nodes as Record<string, unknown>[]) || [];
      
      if (nodes.length === 0) {
        // Violation with no nodes
        csvRows.push([
          violation.id,
          violation.impact,
          violation.description,
          violation.help,
          violation.helpUrl,
          Array.isArray(violation.tags) ? (violation.tags as string[]).join("; ") : "",
          "0",
          "",
        ].map(escapeCSV).join(","));
      } else {
        // One row per affected node
        for (const n of nodes) {
          const node = n as Record<string, unknown>;
          csvRows.push([
            violation.id,
            violation.impact,
            violation.description,
            violation.help,
            violation.helpUrl,
            Array.isArray(violation.tags) ? (violation.tags as string[]).join("; ") : "",
            nodes.length.toString(),
            node.html || "",
          ].map(escapeCSV).join(","));
        }
      }
    }

    const csv = csvRows.join("\n");

    log.info("Scan exported as CSV", { userId, scanId: id });

    return new NextResponse(csv, {
      headers: {
        "Content-Disposition": `attachment; filename="accessibility-scan-${scan.id}.csv"`,
        "Content-Type": "text/csv",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    log.error("CSV export error", { error: error instanceof Error ? error : new Error(errorMessage) });
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
