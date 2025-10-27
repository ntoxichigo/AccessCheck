import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

export interface AccessibilityIssue {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{ html: string; target: string[] }>;
}

export interface ScanResult {
  url: string;
  issuesFound: number;
  violations: AccessibilityIssue[];
  passes: number;
  timestamp: Date;
}

export async function scanWebsite(url: string, limit?: number): Promise<ScanResult> {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const results = await new AxePuppeteer(page).analyze();
    const violations = results.violations.map((violation: any) => ({
      id: violation.id,
      impact: violation.impact as 'critical' | 'serious' | 'moderate' | 'minor',
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node: any) => ({ html: node.html, target: node.target })),
    }));
    const limitedViolations = limit ? violations.slice(0, limit) : violations;
    return {
      url,
      issuesFound: violations.length,
      violations: limitedViolations,
      passes: results.passes.length,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Scan error:', error);
    throw new Error('Failed to scan website. Please check the URL and try again.');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
