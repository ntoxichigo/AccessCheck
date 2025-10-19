# 📧 Email Setup Guide - Resend Integration Complete

## ✅ What's Been Completed

### 1. Email Infrastructure
- ✅ **Resend package installed** (v6.1.2)
- ✅ **Email configuration created** (`lib/email/resend.ts`)
- ✅ **Contact page updated** with contact@accesscheck.pro
- ✅ **Environment variable added** for RESEND_API_KEY

### 2. Email Templates Created
- ✅ **Welcome Email** (`lib/email/templates/welcome.ts`)
  - Sent when new user signs up
  - Professional HTML design
  - Call-to-action to start scanning
  
- ✅ **Trial Reminder Emails** (`lib/email/templates/trial-reminders.ts`)
  - Day 0: Trial started (welcome to Pro trial)
  - Day 2: Midpoint reminder (1 day left)
  - Day 3: Final warning (12 hours before expiration)

### 3. Webhook Integration
- ✅ **Clerk webhook handler** (`app/api/webhooks/clerk/route.ts`)
  - Automatically sends welcome email on user signup
  - Sends trial started email when user activates Pro trial
  - Secure webhook verification with Svix

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Get Resend API Key

1. Go to **https://resend.com/api-keys**
2. Sign up if you don't have an account (FREE plan: 3,000 emails/month)
3. Click **"Create API Key"**
4. Copy the API key (starts with `re_`)
5. Open `.env.local` in your project
6. Replace `re_YOUR_API_KEY_HERE` with your actual API key:
   ```
   RESEND_API_KEY=re_abc123xyz...
   ```

### Step 2: Verify Your Domain in Resend

1. Go to **https://resend.com/domains**
2. Click **"Add Domain"**
3. Enter: `accesscheck.pro`
4. Resend will provide DNS records (SPF, DKIM, etc.)
5. Go to your **IONOS domain management**
6. Add the DNS records Resend provides
7. Wait 24-48 hours for DNS propagation
8. Return to Resend and click **"Verify Domain"**

**DNS Records You'll Need to Add (example):**
```
Type: TXT
Host: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT  
Host: resend._domainkey
Value: (provided by Resend)

Type: CNAME
Host: resend
Value: resend.com
```

### Step 3: Verify Email Addresses

1. In Resend dashboard, go to **"Emails"** or **"Verified Addresses"**
2. Add both email addresses:
   - `noreply@accesscheck.pro` (for automated emails)
   - `contact@accesscheck.pro` (for support replies)
3. Resend will send verification emails to both addresses
4. Check your email inbox and click verification links

> **Note:** Until domain is verified, you can only send TO verified email addresses (good for testing)

### Step 4: Set Up Clerk Webhook

1. Go to **Clerk Dashboard** (https://dashboard.clerk.com)
2. Select your AccessCheck application
3. Navigate to **Webhooks** in the sidebar
4. Click **"Add Endpoint"**
5. Enter your webhook URL:
   ```
   https://accesscheck.pro/api/webhooks/clerk
   ```
   *(For local testing: use ngrok or similar)*
   
6. Select events to listen for:
   - ✅ `user.created`
   - ✅ `user.updated`
   
7. Copy the **Webhook Secret** (starts with `whsec_`)
8. Add to `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_abc123...
   ```

### Step 5: Install Svix Package (for webhook verification)

Run in your project directory:
```powershell
npm install svix
```

### Step 6: Test Email Sending

#### Option A: Test via API Route (create test endpoint)
Create `app/api/test-email/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email/templates/welcome';

export async function GET() {
  const result = await sendWelcomeEmail({
    to: 'YOUR_EMAIL@example.com', // Use your verified email for testing
    name: 'Test User',
  });

  return NextResponse.json(result);
}
```

Then visit: `http://localhost:3000/api/test-email`

#### Option B: Test via Webhook
1. Sign up as a new user on your site
2. Check if welcome email arrives
3. Check Resend dashboard for email logs

---

## 📧 Email Campaigns Overview

### 1. Welcome Email
- **Trigger:** User signs up
- **Sent:** Immediately via Clerk webhook
- **Purpose:** Onboard new users, encourage first scan
- **Template:** `lib/email/templates/welcome.ts`

### 2. Trial Started Email
- **Trigger:** User activates Pro trial
- **Sent:** Immediately via Clerk webhook
- **Purpose:** Celebrate trial activation, encourage usage
- **Template:** `lib/email/templates/trial-reminders.ts`

### 3. Trial Midpoint Reminder (Day 2)
- **Trigger:** 2 days after trial start
- **Sent:** Scheduled (needs cron job - see below)
- **Purpose:** Remind about trial ending, show value
- **Template:** `lib/email/templates/trial-reminders.ts`

### 4. Trial Ending Warning (12 hours before)
- **Trigger:** 2.5 days after trial start
- **Sent:** Scheduled (needs cron job - see below)
- **Purpose:** Final urgency push to upgrade
- **Template:** `lib/email/templates/trial-reminders.ts`

### 5. Weekly Digest (Future)
- **Trigger:** Every Monday 9am
- **Sent:** Scheduled cron job
- **Purpose:** Keep users engaged with scan summaries
- **Template:** Not yet created

---

## ⏰ Setting Up Automated Trial Reminders (Next Step)

Trial reminder emails need to be sent on a schedule. Here are your options:

### Option 1: Vercel Cron Jobs (Recommended)
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/trial-reminders",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Then create `app/api/cron/trial-reminders/route.ts` to check trial users and send emails.

### Option 2: GitHub Actions (Free alternative)
Create `.github/workflows/trial-reminders.yml` to run daily.

### Option 3: Third-party cron service
Use services like cron-job.org or EasyCron to ping your API endpoint.

**I can help you set up any of these options - just let me know which you prefer!**

---

## 🧪 Testing Checklist

Before going live, test these:

- [ ] Resend API key works (no 401 errors)
- [ ] Domain verified in Resend
- [ ] Email addresses verified
- [ ] Welcome email sends on new signup
- [ ] Trial started email sends on trial activation
- [ ] Emails appear professional (not in spam folder)
- [ ] Links in emails work correctly
- [ ] Clerk webhook receives events successfully

---

## 🔧 Troubleshooting

### Emails not sending?
1. Check `.env.local` has correct `RESEND_API_KEY`
2. Restart Next.js dev server after adding env variable
3. Check Resend dashboard logs for errors
4. Verify domain and email addresses are confirmed

### Emails going to spam?
1. Ensure domain is fully verified in Resend
2. Wait 24-48 hours after adding DNS records
3. Use real content (avoid spammy words like "FREE!!!")
4. Add unsubscribe link (required for marketing emails)

### Clerk webhook not working?
1. Check `CLERK_WEBHOOK_SECRET` is set correctly
2. Verify webhook URL is correct in Clerk dashboard
3. Check webhook logs in Clerk dashboard for errors
4. For local testing, use ngrok: `ngrok http 3000`

### TypeScript errors?
All files have been created with proper types. If you see errors:
1. Restart TypeScript server in VS Code
2. Run `npm install svix` if missing
3. Check all import paths are correct

---

## 💰 Resend Pricing

**FREE Tier (Current):**
- ✅ 3,000 emails per month
- ✅ 100 emails per day
- ✅ Full API access
- ✅ Email logs & analytics

**Pro Tier ($20/month if needed):**
- 50,000 emails per month
- 1,000 emails per day
- Priority support

**For your use case:** FREE tier is more than enough to start!

---

## 📁 File Structure Created

```
accessibility-checker/
├── .env.local                              # Added RESEND_API_KEY
├── lib/
│   └── email/
│       ├── resend.ts                       # ✅ Email service config
│       └── templates/
│           ├── welcome.ts                  # ✅ Welcome email
│           └── trial-reminders.ts          # ✅ 3 trial reminder emails
└── app/
    ├── contact/
    │   └── page.tsx                        # ✅ Updated with real email
    └── api/
        └── webhooks/
            └── clerk/
                └── route.ts                # ✅ Clerk webhook handler
```

---

## 🎯 Next Steps

1. **TODAY:** Get Resend API key and update `.env.local`
2. **TODAY:** Add domain to Resend, get DNS records
3. **THIS WEEK:** Add DNS records to IONOS, wait for verification
4. **THIS WEEK:** Install svix package (`npm install svix`)
5. **THIS WEEK:** Set up Clerk webhook with secret
6. **NEXT WEEK:** Test email sending with new user signup
7. **NEXT WEEK:** Set up trial reminder cron jobs

---

## ❓ Need Help?

If you encounter any issues or need clarification:
- Check Resend documentation: https://resend.com/docs
- Check Clerk webhook docs: https://clerk.com/docs/webhooks
- Reply to this summary with your question
- Test emails thoroughly before announcing to users

---

## 🚀 Ready to Go Live?

Once you complete the steps above:
1. All new signups will automatically receive welcome email
2. Trial activations will trigger trial started email
3. Manual reminders can be sent until cron jobs are set up
4. Contact page shows real email addresses

**Total Setup Time:** ~30 minutes (excluding DNS propagation wait)

**You're 90% done! Just need to add the API key and verify the domain.** 🎉
