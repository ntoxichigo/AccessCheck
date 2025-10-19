# Bulk Scanning Feature Guide

## Overview

The Bulk Scanning feature allows Pro and Enterprise users to scan multiple URLs simultaneously using CSV upload or manual input. This feature includes:

- **CSV Upload**: Upload a CSV file with URLs to scan
- **Manual Input**: Paste URLs directly (one per line)
- **Batch Management**: Track progress of all batch scans
- **Queue System**: Automatic processing with configurable concurrency
- **Real-time Progress**: Live updates on scan completion status
- **Export Results**: Download batch results as CSV

---

## Features by Plan

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Bulk Scanning | ❌ | ✅ | ✅ |
| Max URLs per Batch | - | 50 | 500 |
| Concurrent Scans | - | 3 | 3 |
| CSV Export | - | ✅ | ✅ |
| Priority Processing | - | ❌ | ✅ |

---

## How to Use

### 1. Access Bulk Scanner

Navigate to `/bulk-scan` or click the "Bulk Scan" button in the dashboard.

### 2. Upload URLs

**Option A: CSV Upload**

1. Prepare a CSV file with URLs:
   ```csv
   https://example.com
   https://example.com/about
   https://example.com/contact
   ```

2. Drag and drop the file or click "Choose File"

3. URLs will be automatically parsed and validated

**Option B: Manual Input**

1. Paste URLs in the text area (one per line)
2. Click outside the text area to validate

### 3. Configure Batch

- **Batch Name** (optional): Give your batch a descriptive name
- **Review URLs**: Check the list of URLs to be scanned
- **Remove URLs**: Click the "×" next to any URL to remove it

### 4. Submit Batch

Click "Scan X URLs" to start the batch scan.

### 5. Monitor Progress

- View real-time progress in the "Your Batch Scans" section
- Progress bar shows completion percentage
- Click on any batch to view detailed results

### 6. View Results

Click on a completed batch to see:
- Individual scan results
- Issue counts per URL
- Links to full reports
- Export to CSV option

---

## Technical Architecture

### Components

#### Frontend
- **`/app/bulk-scan/page.tsx`**: Main bulk scan interface
- **`/components/BatchScanResults.tsx`**: Results display component
- **CSV Parser**: Client-side URL extraction from CSV files
- **Real-time Updates**: 5-second polling for batch status

#### Backend
- **`/app/api/bulk-scan/route.ts`**: API endpoint for batch operations
- **`/lib/queue/scan-queue.ts`**: In-memory job queue system
- **Database Models**: BatchScan and Scan (with batchId relation)

### Queue System

The scan queue uses an in-memory processing system with:

- **Concurrency**: 3 workers processing scans in parallel
- **Retry Logic**: Automatic retry up to 3 times on failure
- **Automatic Start**: Queue starts processing when jobs are added
- **Progress Tracking**: Real-time updates to batch status

```typescript
// Queue stats
{
  queueLength: number;      // Pending jobs
  activeWorkers: number;    // Currently processing
  processing: boolean;      // Queue is active
}
```

### Database Schema

```prisma
model BatchScan {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  name          String?
  totalUrls     Int
  completedUrls Int      @default(0)
  failedUrls    Int      @default(0)
  status        String   @default("pending") // pending, processing, completed, failed
  createdAt     DateTime @default(now())
  completedAt   DateTime?
  scans         Scan[]
}

model Scan {
  id          String   @id @default(cuid())
  url         String
  userId      String?
  status      String   // pending, processing, completed, failed
  issuesFound Int
  results     Json
  batchId     String?
  batch       BatchScan? @relation(fields: [batchId], references: [id])
  createdAt   DateTime @default(now())
}
```

---

## API Reference

### Create Batch Scan

**Endpoint:** `POST /api/bulk-scan`

**Request Body:**
```json
{
  "urls": ["https://example.com", "https://example.com/about"],
  "name": "October Audit"
}
```

**Response:**
```json
{
  "success": true,
  "batchId": "clx123abc",
  "totalUrls": 2,
  "invalidUrls": [],
  "message": "Batch scan created with 2 URLs. Processing started."
}
```

**Error Responses:**
- `401`: Unauthorized (not signed in)
- `403`: Forbidden (requires Pro or Enterprise plan)
- `400`: Bad request (invalid URLs, exceeds limit, etc.)

### Get Batch Status

**Endpoint:** `GET /api/bulk-scan?batchId={id}`

**Response:**
```json
{
  "id": "clx123abc",
  "name": "October Audit",
  "totalUrls": 2,
  "completedUrls": 1,
  "failedUrls": 0,
  "status": "processing",
  "createdAt": "2025-10-15T10:00:00Z",
  "scans": [
    {
      "id": "scan123",
      "url": "https://example.com",
      "status": "completed",
      "issuesFound": 5,
      "createdAt": "2025-10-15T10:00:00Z"
    }
  ]
}
```

### Get All Batches

**Endpoint:** `GET /api/bulk-scan`

**Response:**
```json
{
  "batches": [
    {
      "id": "clx123abc",
      "name": "October Audit",
      "totalUrls": 50,
      "completedUrls": 50,
      "failedUrls": 0,
      "status": "completed",
      "createdAt": "2025-10-15T10:00:00Z",
      "completedAt": "2025-10-15T10:30:00Z"
    }
  ]
}
```

---

## Performance Considerations

### Limits

- **Pro Plan**: Maximum 50 URLs per batch
- **Enterprise Plan**: Maximum 500 URLs per batch
- **Concurrency**: 3 scans processed simultaneously
- **Timeout**: 2 minutes per individual scan

### Processing Time

Estimated processing times:

| URLs | Pro Plan (3 workers) | Enterprise (3 workers) |
|------|---------------------|------------------------|
| 10   | ~3-5 minutes        | ~3-5 minutes           |
| 50   | ~15-20 minutes      | ~15-20 minutes         |
| 100  | -                   | ~30-40 minutes         |
| 500  | -                   | ~2.5-3 hours           |

*Note: Times vary based on website complexity and response times.*

### Optimization Tips

1. **Group Related Pages**: Scan pages from the same domain in one batch for faster results
2. **Avoid Peak Hours**: Schedule large batches during off-peak hours
3. **Check Individual Scans**: If a batch is slow, check for failed scans that may be retrying
4. **Use Descriptive Names**: Name batches clearly for easy tracking

---

## Upgrading to Redis Queue (Production)

For production deployments with high volume, replace the in-memory queue with **Redis + BullMQ**:

### Installation

```bash
npm install bullmq ioredis
```

### Configuration

```typescript
// lib/queue/scan-queue-redis.ts
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL);

const scanQueue = new Queue('scans', { connection });

const worker = new Worker('scans', async (job) => {
  // Process scan job
  const { scanId, url, userId, batchId } = job.data;
  // ... scan logic
}, { connection });

export { scanQueue };
```

### Benefits

- **Persistence**: Jobs survive server restarts
- **Scalability**: Distribute workers across multiple servers
- **Monitoring**: Built-in UI for job tracking
- **Advanced Features**: Scheduled jobs, priorities, rate limiting

---

## Troubleshooting

### Issue: Batch stuck in "processing" status

**Possible Causes:**
- Server restart interrupted processing
- All scans failed and exceeded retry limit
- Queue worker crashed

**Solution:**
1. Refresh the page to check latest status
2. Check individual scan statuses in batch details
3. Check server logs for errors
4. Restart the server if necessary

### Issue: Some scans failed

**Possible Causes:**
- Invalid URLs
- Website is down or unreachable
- Website blocks automated scans
- Timeout exceeded

**Solution:**
1. Click on the batch to see which URLs failed
2. Verify URLs are accessible in a browser
3. Re-scan failed URLs individually
4. Contact support if issue persists

### Issue: CSV upload not parsing URLs

**Possible Causes:**
- CSV format incorrect
- URLs contain special characters
- File encoding issues

**Solution:**
1. Ensure CSV has one URL per line
2. URLs must start with http:// or https://
3. Remove any extra columns or headers
4. Try manual paste instead

### Issue: "Bulk scanning requires Pro plan" error

**Cause:** User account is on Free plan

**Solution:**
1. Upgrade to Pro or Enterprise plan
2. Visit `/pricing` to see plan options
3. Free trial available for new users

---

## Future Enhancements

### Planned Features

1. **Email Notifications**
   - Notification when batch completes
   - Summary of results in email
   - Link to view full report

2. **Advanced Filtering**
   - Filter by issue severity
   - Filter by WCAG level
   - Search within batch results

3. **Scheduling**
   - Schedule batch scans for specific times
   - Recurring scans (daily, weekly, monthly)
   - Automated re-scanning

4. **Comparison**
   - Compare batch results over time
   - Track improvements/regressions
   - Historical trend analysis

5. **Webhooks**
   - Callback URLs for batch completion
   - Integration with CI/CD pipelines
   - Slack/Discord notifications

---

## Support

For issues or questions about bulk scanning:

1. Check this documentation first
2. Review [Deployment Instructions](./DEPLOYMENT_INSTRUCTIONS.md)
3. Check server logs for errors
4. Contact support with batch ID for assistance

---

## Best Practices

1. **Start Small**: Test with 5-10 URLs first before running large batches
2. **Descriptive Names**: Use clear naming conventions (e.g., "Homepage-Oct-2025")
3. **Regular Scans**: Schedule regular batch scans to track compliance over time
4. **Review Results**: Don't just scan - review and act on findings
5. **Export Data**: Keep CSV exports for compliance documentation

---

**Ready to scan at scale!** 🚀
