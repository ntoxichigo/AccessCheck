import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const scan = await prisma.scan.findUnique({
      where: { id },
    });
    if (!scan) {
      return NextResponse.json({ success: false, error: "Report not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, scan });
  } catch (err) {
    console.error('Error fetching scan:', err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
