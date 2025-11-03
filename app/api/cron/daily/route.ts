import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function callEndpoint(path: string, secret: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || '';
  const url = base.startsWith('http') ? `${base}${path}` : `https://${base}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${secret}`,
    },
    // Avoid caching
    cache: 'no-store',
  });
  const json = await res.json().catch(() => ({ ok: res.ok }));
  return { status: res.status, ok: res.ok, json };
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = process.env.CRON_SECRET || '';
    const results: any = { trialReminders: null, endTrials: null };

    // Run trial reminders first (09:00 UTC), then end trials (01:00 UTC equivalent combined)
    results.trialReminders = await callEndpoint('/api/cron/trial-reminders', secret);
    results.endTrials = await callEndpoint('/api/cron/end-trials', secret);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
