import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/db/prisma";

export const runtime = "nodejs";

export async function POST() {
  try {
    let userId: string | null = null;
    try {
      const a = auth();
      // @ts-ignore
      userId = a?.userId ?? null;
    } catch {
      userId = null;
    }

    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email: userId, subscription: "pro" },
      update: { subscription: "pro" },
    });

    return NextResponse.json({ ok: true, tier: user.subscription });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
