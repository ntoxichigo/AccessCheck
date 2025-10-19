# Trial Reminder Email System

## Overview

Automated email system that sends timely reminders to users during their 14-day free trial to maximize trial-to-paid conversion rates.

## Expected Impact

- **30-50% improvement** in trial-to-paid conversion
- **Reduced churn** at trial expiration
- **Increased user engagement** during critical trial period

---

## Email Schedule

| Day | Trigger | Email Type | Purpose |
|-----|---------|------------|---------|
| 7 | Halfway point | Mid-trial check-in | Ensure user engagement, offer help |
| 12 | 2 days remaining | Urgency reminder | Create urgency, highlight value |
| 13 | 1 day remaining | Last chance | Final push to convert |

---

## Implementation Files

### 1. Email Templates
**File:** `lib/trial-reminder-emails.ts`

Three email functions:
- `sendTrialDay7Email()` - Halfway check-in
- `sendTrialDay12Email()` - 2 days left reminder
- `sendTrialDay13Email()` - Final day reminder

Each email includes:
- Personalized greeting
- Days remaining counter
- Value proposition
- Clear CTA to upgrade
- Helpful resources

### 2. Cron Job API
**File:** `app/api/cron/trial-reminders/route.ts`

- Runs daily at 9 AM UTC
- Checks all users in active trials
- Sends appropriate reminder based on trial day
- Logs all sent emails to audit trail
- Returns summary statistics

### 3. Vercel Cron Configuration
**File:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/trial-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

---

## Setup Instructions

### Step 1: Environment Variables

Add to `.env.local` and Vercel environment variables:

```bash
# Generate a secure random string
CRON_SECRET=your-secure-random-string

# Resend API for email sending
RESEND_API_KEY=re_your_api_key
```

**Generate CRON_SECRET:**
```powershell
# PowerShell (Windows)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Bash (Linux/Mac)
openssl rand -base64 32
```

### Step 2: Prisma Schema

Ensure these fields exist in your `User` model (already present):

```prisma
model User {
  // ... other fields
  trialStarted  DateTime?
  trialEnds     DateTime?
  hadTrial      Boolean  @default(false)
}
```

### Step 3: Deploy to Vercel

1. Push code to your repository
2. Vercel will automatically detect `vercel.json` and configure the cron job
3. Add `CRON_SECRET` to Vercel environment variables:
   - Go to Project Settings → Environment Variables
   - Add `CRON_SECRET` with the same value from `.env.local`

---

## Testing Locally

### Manual Trigger Test

```bash
# Install dependencies
npm install

# Run the API endpoint manually
curl -X POST http://localhost:3000/api/cron/trial-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Create Test Trial User

```typescript
// In Prisma Studio or admin panel
await prisma.user.update({
  where: { email: 'test@example.com' },
  data: {
    trialStarted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    trialEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    hadTrial: false
  }
});
```

### Monitor Logs

Check Vercel logs or local terminal for:
```
📧 Processing X trial users for reminders
✅ Trial reminders sent: { day7: 1, day12: 0, day13: 0, errors: [] }
```

---

## Email Content Best Practices

### Day 7 Email (Mid-Trial)
- **Subject:** "You're halfway through your AccessCheck trial!"
- **Focus:** Engagement check, offer help
- **CTA:** "Need help? Book a demo" or "Explore features"

### Day 12 Email (2 Days Left)
- **Subject:** "Only 2 days left in your AccessCheck trial"
- **Focus:** Create urgency, highlight unused features
- **CTA:** "Upgrade now to keep access"

### Day 13 Email (Last Day)
- **Subject:** "Last chance: Your trial ends tomorrow"
- **Focus:** FOMO, clear benefits of upgrading
- **CTA:** "Upgrade before midnight"

---

## Monitoring & Analytics

### Audit Log Tracking

Every sent email is logged:

```typescript
await prisma.auditLog.create({
  data: {
    userId: user.id,
    action: 'trial_reminder_day7_sent',
    details: { email: user.email, daysRemaining: 7 }
  }
});
```

### Track Conversion Rates

Query audit logs to measure effectiveness:

```typescript
// Users who received reminders
const remindersent = await prisma.auditLog.count({
  where: { action: { startsWith: 'trial_reminder_' } }
});

// Users who converted after reminder
const conversions = await prisma.user.count({
  where: {
    hadTrial: true,
    subscription: { in: ['pro', 'enterprise'] }
  }
});

const conversionRate = (conversions / remindersSent) * 100;
```

---

## Troubleshooting

### Emails Not Sending

1. **Check Resend API Key:**
   ```bash
   curl https://api.resend.com/emails \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

2. **Verify Cron Job is Running:**
   - Go to Vercel dashboard → Deployments → Cron Jobs
   - Check execution history

3. **Check Database:**
   ```sql
   SELECT email, "trialStarted", "trialEnds", "hadTrial"
   FROM "User"
   WHERE "trialEnds" > NOW() AND "hadTrial" = false;
   ```

### Cron Job Not Triggering

1. **Verify `vercel.json` is deployed:**
   - Check Vercel deployment logs
   - Ensure file is in root directory

2. **Check Cron Secret:**
   - Must match exactly in `.env.local` and Vercel environment variables
   - Case-sensitive

3. **Timezone Issues:**
   - Cron runs at 9 AM UTC
   - Adjust in `vercel.json` if needed: `"schedule": "0 14 * * *"` (2 PM UTC)

---

## Future Enhancements

- [ ] A/B test different email subject lines
- [ ] Add personalized feature usage statistics
- [ ] Send success stories from other users
- [ ] Dynamic CTA buttons based on user behavior
- [ ] Integrate with Segment/Mixpanel for deeper analytics
- [ ] Add SMS reminders for high-value leads
- [ ] Create custom landing pages for email CTAs

---

## ROI Calculation

Assuming:
- 100 trial users per month
- 20% baseline conversion (without reminders)
- 40% conversion with reminders (+20% lift)
- $15/month Pro plan

**Monthly Impact:**
- Without reminders: 100 × 20% = 20 conversions = $300/month
- With reminders: 100 × 40% = 40 conversions = $600/month
- **Additional revenue: $300/month = $3,600/year**

**Development Cost:**
- Implementation time: ~2 hours
- Email service cost: ~$0 (Resend free tier: 3,000 emails/month)
- **ROI: ∞** (essentially free recurring revenue)

---

## Support

For questions or issues:
1. Check Vercel logs for error messages
2. Review Resend dashboard for email delivery status
3. Verify audit logs in database for sent emails
4. Contact support with specific error messages
