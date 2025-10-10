import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/db/prisma";

export const runtime = "nodejs";

export async function POST() {
  try {
    let userId: string | null = null;
    try {
      const a = auth();
      // @ts-expect-error Clerk's auth type narrows at runtime in middleware context
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
  } catch (e) {
    const message = (e as Error)?.message || "Error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
