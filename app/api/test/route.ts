import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ 
    message: 'POST is working!',
    receivedData: body,
    timestamp: new Date().toISOString()
  });
}
