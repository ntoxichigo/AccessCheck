import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

export async function scanWebsite(url: string, limit?: number) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const results = await new AxePuppeteer(page).analyze();

    const violations = results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map(n => ({ html: n.html, target: n.target })),
    }));

    return {
      url,
      issuesFound: violations.length,
      violations: limit ? violations.slice(0, limit) : violations,
      passes: results.passes.length,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Scan error:', error);
    throw new Error('Failed to scan website.');
  } finally {
    if (browser) await browser.close();
  }
}
