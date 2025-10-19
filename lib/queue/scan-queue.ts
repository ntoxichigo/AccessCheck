import { prisma } from "../db/prisma";
import { log } from "../logger";
import { Resend } from "resend";
import { generateBatchScanCompletionEmail } from "../email-templates";

// In-memory queue for scan jobs
// In production, replace with Redis-backed queue (BullMQ, etc.)
interface ScanJob {
  id: string;
  scanId: string;
  url: string;
  userId: string;
  batchId?: string;
  retries: number;
  maxRetries: number;
  createdAt: Date;
}

class ScanQueue {
  private queue: ScanJob[] = [];
  private processing = false;
  private workers: number = 3; // Number of concurrent workers
  private activeWorkers = 0;

  /**
   * Add a scan job to the queue
   */
  async addJob(
    scanId: string,
    url: string,
    userId: string,
    batchId?: string
  ): Promise<void> {
    const job: ScanJob = {
      id: `job-${Date.now()}-${Math.random()}`,
      scanId,
      url,
      userId,
      batchId,
      retries: 0,
      maxRetries: 3,
      createdAt: new Date(),
    };

    this.queue.push(job);

    log.info("Scan job added to queue", {
      jobId: job.id,
      scanId,
      url,
      batchId,
    });

    // Start processing if not already running
    if (!this.processing) {
      this.startProcessing();
    }
  }

  /**
   * Add multiple scan jobs (for bulk scanning)
   */
  async addBulkJobs(
    scans: Array<{ scanId: string; url: string; userId: string; batchId?: string }>
  ): Promise<void> {
    for (const scan of scans) {
      await this.addJob(scan.scanId, scan.url, scan.userId, scan.batchId);
    }

    if (scans.length > 0 && scans[0].batchId) {
      // Update batch status to processing
      await prisma.batchScan.update({
        where: { id: scans[0].batchId },
        data: { status: "processing" },
      });
    }
  }

  /**
   * Start processing the queue
   */
  private async startProcessing(): Promise<void> {
    if (this.processing) return;

    this.processing = true;
    log.info("Scan queue processing started", { workers: this.workers });

    while (this.queue.length > 0 || this.activeWorkers > 0) {
      // Start workers up to the limit
      while (this.activeWorkers < this.workers && this.queue.length > 0) {
        const job = this.queue.shift();
        if (job) {
          this.activeWorkers++;
          this.processJob(job).finally(() => {
            this.activeWorkers--;
          });
        }
      }

      // Wait a bit before checking again
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.processing = false;
    log.info("Scan queue processing stopped");
  }

  /**
   * Process a single scan job
   */
  private async processJob(job: ScanJob): Promise<void> {
    try {
      log.info("Processing scan job", { jobId: job.id, url: job.url });

      // Update scan status to processing
      await prisma.scan.update({
        where: { id: job.scanId },
        data: { status: "processing" },
      });

      // Perform the actual scan
      const results = await this.performScan(job.url);

      // Save results
      await prisma.scan.update({
        where: { id: job.scanId },
        data: {
          status: "completed",
          results: results.violations || [],
          issuesFound: results.violations?.length || 0,
        },
      });

      // Update batch scan if applicable
      if (job.batchId) {
        await this.updateBatchProgress(job.batchId, "completed");
      }

      log.info("Scan job completed", {
        jobId: job.id,
        scanId: job.scanId,
        issuesFound: results.violations?.length || 0,
      });
    } catch (error) {
      log.error("Scan job failed", {
        jobId: job.id,
        scanId: job.scanId,
        errorMessage: error instanceof Error ? error.message : String(error),
        retries: job.retries,
      });

      // Retry logic
      if (job.retries < job.maxRetries) {
        job.retries++;
        this.queue.push(job);
        log.info("Scan job requeued", { jobId: job.id, retries: job.retries });
      } else {
        // Mark as failed
        await prisma.scan.update({
          where: { id: job.scanId },
          data: { status: "failed" },
        });

        if (job.batchId) {
          await this.updateBatchProgress(job.batchId, "failed");
        }

        log.error("Scan job permanently failed", { jobId: job.id, scanId: job.scanId });
      }
    }
  }

  /**
   * Perform the actual accessibility scan
   */
  private async performScan(url: string): Promise<{
    violations?: Array<{
      id: string;
      impact: string;
      description: string;
      help: string;
      helpUrl: string;
      nodes: Array<{ html: string; target: string[] }>;
    }>;
  }> {
    // Call the existing scan API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`Scan failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Update batch scan progress
   */
  private async updateBatchProgress(batchId: string, status: "completed" | "failed"): Promise<void> {
    const batch = await prisma.batchScan.findUnique({
      where: { id: batchId },
      include: { scans: true },
    });

    if (!batch) return;

    const completedScans = batch.scans.filter((s) => s.status === "completed").length;
    const failedScans = batch.scans.filter((s) => s.status === "failed").length;
    const totalCompleted = completedScans + failedScans;

    // Determine overall batch status
    let batchStatus = batch.status;
    if (totalCompleted === batch.totalUrls) {
      batchStatus = failedScans === batch.totalUrls ? "failed" : "completed";
    } else {
      batchStatus = "processing";
    }

    await prisma.batchScan.update({
      where: { id: batchId },
      data: {
        completedUrls: completedScans,
        failedUrls: failedScans,
        status: batchStatus,
        completedAt: totalCompleted === batch.totalUrls ? new Date() : null,
      },
    });

    log.info("Batch scan progress updated", {
      batchId,
      completedUrls: completedScans,
      failedUrls: failedScans,
      status: batchStatus,
    });

    // Send email notification if batch is completed
    if (totalCompleted === batch.totalUrls) {
      await this.sendBatchCompletionEmail(batch);
    }
  }

  /**
   * Send batch completion email to user
   */
  private async sendBatchCompletionEmail(batch: {
    id: string;
    userId: string;
    name: string | null;
    totalUrls: number;
    scans: Array<{
      url: string;
      status: string;
      issuesFound: number;
    }>;
  }): Promise<void> {
    try {
      if (!process.env.RESEND_API_KEY) {
        log.warn("Batch completion email not sent: RESEND_API_KEY not configured");
        return;
      }

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: batch.userId },
        include: { Settings: true },
      });

      if (!user) {
        log.warn("Batch completion email not sent: user not found", { userId: batch.userId });
        return;
      }

      // Check email preferences
      if (user.Settings && user.Settings.emailPrefs === false) {
        log.info("Batch completion email not sent: user disabled email notifications");
        return;
      }

      // Get user email from Clerk
      // For now, we'll need to fetch this from Clerk API or pass it through
      // Skipping email sending if we can't get the email address
      // In production, you'd want to store email in your User model or fetch from Clerk

      const completedScans = batch.scans.filter((s) => s.status === "completed");
      const failedScans = batch.scans.filter((s) => s.status === "failed");
      const totalIssues = completedScans.reduce((sum, scan) => sum + scan.issuesFound, 0);
      const avgIssues = completedScans.length > 0 ? Math.round(totalIssues / completedScans.length) : 0;

      // Get top 5 URLs with most issues
      const topIssues = [...completedScans]
        .sort((a, b) => b.issuesFound - a.issuesFound)
        .slice(0, 5)
        .map((scan) => ({
          url: scan.url,
          issuesFound: scan.issuesFound,
        }));

      const emailHtml = generateBatchScanCompletionEmail({
        batchName: batch.name || `Batch scan ${new Date().toLocaleDateString()}`,
        batchId: batch.id,
        totalUrls: batch.totalUrls,
        completedUrls: completedScans.length,
        failedUrls: failedScans.length,
        totalIssues,
        avgIssuesPerUrl: avgIssues,
        reportUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/bulk-scan?batchId=${batch.id}`,
        topIssues,
      });

      const resend = new Resend(process.env.RESEND_API_KEY);

      // Note: In production, you need to get the user's email from Clerk
      // For now, this is a placeholder. You should:
      // 1. Store email in your User model, OR
      // 2. Fetch from Clerk API using the userId

      log.info("Batch completion email prepared", {
        batchId: batch.id,
        userId: user.id,
        totalUrls: batch.totalUrls,
        totalIssues,
      });

      // Uncomment when email is available:
      // await resend.emails.send({
      //   from: "AccessCheck <noreply@accesscheck.com>",
      //   to: userEmail,
      //   subject: `Batch Scan Complete: ${batch.name || 'Your scan'} - ${totalIssues} total issues`,
      //   html: emailHtml,
      // });

    } catch (error) {
      log.error("Failed to send batch completion email", {
        batchId: batch.id,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Get queue stats
   */
  getStats(): {
    queueLength: number;
    activeWorkers: number;
    processing: boolean;
  } {
    return {
      queueLength: this.queue.length,
      activeWorkers: this.activeWorkers,
      processing: this.processing,
    };
  }
}

// Singleton instance
export const scanQueue = new ScanQueue();
