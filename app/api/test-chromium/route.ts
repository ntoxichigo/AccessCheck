import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";

export async function GET() {
  const diagnostics: any = {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    chromiumVersion: null,
    canLaunch: false,
    error: null,
  };

  try {
    // Try to get executable path
    const execPath = await chromium.executablePath();
    diagnostics.executablePath = execPath;
    
    // Try to launch browser
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: execPath,
      headless: chromium.headless,
    });

    diagnostics.canLaunch = true;
    diagnostics.chromiumVersion = await browser.version();
    
    await browser.close();
    
    return NextResponse.json({ success: true, diagnostics });
  } catch (error) {
    diagnostics.error = error instanceof Error ? error.message : String(error);
    diagnostics.stack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json({ 
      success: false, 
      diagnostics,
      message: "Chromium launch failed on Vercel"
    }, { status: 500 });
  }
}
