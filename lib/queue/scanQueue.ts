import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { scanWebsite } from '../scanner/axe-scanner';
import { prisma } from '../db/prisma';

// Redis connection
const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Create scan queue
export const scanQueue = new Queue('accessibility-scans', { connection });

// Job data interface
interface ScanJobData {
  url: string;
  userId: string;
  scanId: string;
  scheduledScanId?: string;
}

// Process scan jobs
export const startScanWorker = () => {
  const worker = new Worker<ScanJobData>(
    'accessibility-scans',
    async (job: Job<ScanJobData>) => {
      const { url, userId, scanId, scheduledScanId } = job.data;

      try {
        console.log(`Processing scan job ${job.id} for ${url}`);

        // Perform the scan
        const results = await scanWebsite(url);

        // Update scan in database
        const scan = await prisma.scan.update({
          where: { id: scanId },
          data: {
            status: 'completed',
            results: results as any,
          },
        });

        // If this is part of a scheduled scan, check for new issues
        if (scheduledScanId) {
          await checkForNewIssues(scheduledScanId, scanId, results);
        }

        console.log(`Scan job ${job.id} completed`);

        return { success: true, issuesFound: results.issuesFound };
      } catch (error) {
        console.error(`Scan job ${job.id} failed:`, error);

        // Update scan as failed
        await prisma.scan.update({
          where: { id: scanId },
          data: { status: 'failed' },
        });

        throw error;
      }
    },
    { connection }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
  });

  return worker;
};

// Check for new accessibility issues
async function checkForNewIssues(
  scheduledScanId: string,
  currentScanId: string,
  currentResults: any
) {
  // TODO: ScheduledScan model not yet implemented in schema
  // Uncomment this code after adding ScheduledScan model to prisma/schema.prisma
  return;
  
  /*
  try {
    // Get the scheduled scan configuration
    const scheduledScan = await prisma.scheduledScan.findUnique({
      where: { id: scheduledScanId },
      include: { user: true },
    });

    if (!scheduledScan) return;

    // Get previous scan for this scheduled scan
    const previousScans = await prisma.scan.findMany({
      where: {
        userId: scheduledScan.userId,
        url: scheduledScan.url,
        status: 'completed',
        id: { not: currentScanId },
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (previousScans.length === 0) return;

    const previousScan = previousScans[0];
    const previousResults = previousScan.results as any;

    // Compare results
    const currentIssueIds = currentResults.violations.map((v: any) => v.id);
    const previousIssueIds = previousResults.violations?.map((v: any) => v.id) || [];

    const newIssues = currentIssueIds.filter((id: string) => !previousIssueIds.includes(id));

    // If new issues detected, send alert
    if (newIssues.length > 0 && scheduledScan.alertOnNewIssues) {
      await sendIssueAlert(scheduledScan, newIssues, currentScanId);
    }

    // Update last run
    await prisma.scheduledScan.update({
      where: { id: scheduledScanId },
      data: {
        lastRun: new Date(),
        lastScanId: currentScanId,
      },
    });
  } catch (error) {
    console.error('Error checking for new issues:', error);
  }
  */
}

// Send alert email for new issues
async function sendIssueAlert(scheduledScan: any, newIssues: string[], scanId: string) {
  // TODO: Implement email sending
  // For now, just log
  console.log(`Alert: ${newIssues.length} new issues detected for ${scheduledScan.url}`);
  console.log(`Scan ID: ${scanId}`);
  console.log(`User email: ${scheduledScan.user?.email}`);

  // In production, integrate with email service (SendGrid, Resend, etc.)
  // Example:
  // await sendEmail({
  //   to: scheduledScan.user.email,
  //   subject: `Alert: ${newIssues.length} New Accessibility Issues Detected`,
  //   body: `New issues found on ${scheduledScan.url}. View report: ${process.env.NEXT_PUBLIC_APP_URL}/scan/${scanId}`
  // });
}

// Add a scan job to the queue
export async function addScanJob(
  url: string,
  userId: string,
  scanId: string,
  scheduledScanId?: string
) {
  await scanQueue.add('scan', {
    url,
    userId,
    scanId,
    scheduledScanId,
  });
}
