# Integrating Trial System with Your App

## Overview

This guide shows how to integrate the trial reminder system with your existing authentication and payment flows.

---

## 1. Start Trial on Sign-Up (Clerk Webhook)

When a new user signs up with Clerk, automatically start their 14-day Pro trial.

### Create Clerk Webhook Handler

**File:** `app/api/webhooks/clerk/route.ts`

```typescript
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { startUserTrial } from '@/lib/trial-management';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', { status: 400 });
  }

  // Handle the event
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      console.error('No email found for user:', id);
      return new Response('No email found', { status: 400 });
    }

    try {
      // Create user in database
      const user = await prisma.user.create({
        data: {
          id,
          email,
        },
      });

      // Start 14-day trial
      await startUserTrial(user.id, user.email);

      console.log(`✅ User ${email} created and trial started`);

      return new Response('User created and trial started', { status: 200 });
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}
```

### Configure Clerk Webhook

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **Webhooks** in the sidebar
4. Click **Add Endpoint**
5. Set endpoint URL: `https://your-domain.com/api/webhooks/clerk`
6. Subscribe to event: `user.created`
7. Copy the **Signing Secret**
8. Add to `.env.local`:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## 2. Convert Trial to Paid (Stripe Webhook)

When a user successfully subscribes, mark their trial as converted.

### Update Stripe Webhook Handler

**File:** `app/api/webhooks/stripe/route.ts`

Add this to your existing Stripe webhook handler:

```typescript
import { convertTrialToPaid } from '@/lib/trial-management';

// In your webhook handler
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const userId = session.client_reference_id; // Pass user ID when creating checkout
  const priceId = session.line_items?.data[0]?.price?.id;

  // Determine plan from price ID
  let plan: 'pro' | 'enterprise' = 'pro';
  if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
    plan = 'enterprise';
  }

  try {
    // Update user subscription
    await prisma.user.update({
      where: { id: userId },
      data: { subscription: plan },
    });

    // Convert trial to paid (marks hadTrial = true)
    await convertTrialToPaid(userId, plan);

    console.log(`✅ User ${userId} upgraded to ${plan}`);
  } catch (error) {
    console.error('Error updating subscription:', error);
  }
}
```

### Pass User ID to Stripe Checkout

When creating a checkout session, include the user ID:

```typescript
import { auth } from '@clerk/nextjs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const { userId } = auth();
  const { priceId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    client_reference_id: userId, // ← Pass user ID here
  });

  return Response.json({ url: session.url });
}
```

---

## 3. Display Trial Status in Dashboard

Show trial information in the user's dashboard.

**File:** `app/dashboard/page.tsx`

```typescript
import { auth } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';
import { getTrialStatus } from '@/lib/trial-management';
import TrialBanner from '@/components/TrialBanner';

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const trialStatus = await getTrialStatus(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Show trial banner if user is in trial */}
      {trialStatus.inTrial && (
        <TrialBanner daysRemaining={trialStatus.daysRemaining!} />
      )}

      {/* Rest of dashboard */}
      <h1>Dashboard</h1>
      {/* ... */}
    </div>
  );
}
```

---

## 4. Gate Pro Features Behind Trial/Subscription

Only allow Pro features for users in trial or with paid subscription.

**File:** `lib/check-pro-access.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { getTrialStatus } from './trial-management';

const prisma = new PrismaClient();

export async function hasProAccess(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscription: true },
  });

  if (!user) return false;

  // Has paid Pro or Enterprise subscription
  if (user.subscription === 'pro' || user.subscription === 'enterprise') {
    return true;
  }

  // Check if in active trial
  const trialStatus = await getTrialStatus(userId);
  return trialStatus.inTrial;
}
```

**Usage in API routes:**

```typescript
import { hasProAccess } from '@/lib/check-pro-access';

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check Pro access (paid or trial)
  const canAccess = await hasProAccess(userId);

  if (!canAccess) {
    return Response.json(
      { error: 'Pro subscription required' },
      { status: 403 }
    );
  }

  // Proceed with Pro feature...
}
```

---

## 5. Show Upgrade Prompts When Trial Ends

Display upgrade modals for users whose trials have expired.

**File:** `components/TrialExpiredModal.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@/components/ui/dialog';

interface TrialExpiredModalProps {
  show: boolean;
  onClose: () => void;
}

export default function TrialExpiredModal({ show, onClose }: TrialExpiredModalProps) {
  const router = useRouter();

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <div className="bg-white rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Your trial has ended</h2>
        <p className="text-gray-600 mb-6">
          Your 14-day Pro trial has expired. Upgrade now to continue accessing
          premium features.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/pricing')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Upgrade to Pro
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200"
          >
            Continue with Free Plan
          </button>
        </div>
      </div>
    </Dialog>
  );
}
```

**Use in dashboard:**

```typescript
'use client';

import { useEffect, useState } from 'react';
import TrialExpiredModal from '@/components/TrialExpiredModal';

export default function DashboardClient({ trialStatus }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal if trial just expired
    if (!trialStatus.inTrial && trialStatus.message === 'Trial expired') {
      setShowModal(true);
    }
  }, [trialStatus]);

  return (
    <>
      {/* Dashboard content */}
      <TrialExpiredModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
```

---

## 6. Usage Tracking (Scan Limits)

Track scans and enforce limits based on subscription level.

**File:** `app/api/scan/route.ts`

```typescript
import { auth } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';
import { hasProAccess } from '@/lib/check-pro-access';

const prisma = new PrismaClient();

const SCAN_LIMITS = {
  free: 1, // 1 scan per day
  pro: 10, // 10 scans per day
  enterprise: Infinity, // Unlimited
};

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscription: true },
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  // Determine effective subscription (trial users get Pro limits)
  let effectivePlan = user.subscription;
  if (user.subscription === 'free') {
    const hasProTrialAccess = await hasProAccess(userId);
    if (hasProTrialAccess) {
      effectivePlan = 'pro'; // Trial users get Pro limits
    }
  }

  // Check scan count for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scansToday = await prisma.scan.count({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  const limit = SCAN_LIMITS[effectivePlan as keyof typeof SCAN_LIMITS];

  if (scansToday >= limit) {
    return Response.json(
      {
        error: 'Scan limit reached',
        limit,
        scansToday,
        upgradeRequired: effectivePlan === 'free',
      },
      { status: 429 }
    );
  }

  // Proceed with scan...
  const { url } = await req.json();

  const scan = await prisma.scan.create({
    data: {
      url,
      userId,
      status: 'pending',
      // ... other fields
    },
  });

  return Response.json({ scanId: scan.id });
}
```

---

## 7. Environment Variables Needed

Add these to `.env.local` and Vercel:

```bash
# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# Resend (Email)
RESEND_API_KEY=re_...

# Trial System (Cron Jobs)
CRON_SECRET=your-generated-secret

# Database
DATABASE_URL=postgresql://...

# App Config
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 8. Testing the Complete Flow

### Test User Journey

1. **Sign Up:**
   ```
   - User creates account
   - Clerk webhook fires
   - User created in database
   - Trial started (14 days)
   - Welcome email sent
   ```

2. **Day 7:**
   ```
   - Cron job runs at 9 AM UTC
   - Day 7 reminder email sent
   - Audit log created
   ```

3. **Day 12:**
   ```
   - 2-day warning email sent
   - Urgency messaging
   ```

4. **Day 13:**
   ```
   - Last day email sent
   - Final CTA to upgrade
   ```

5. **User Upgrades:**
   ```
   - Stripe checkout completed
   - Webhook fires
   - Trial converted to paid
   - hadTrial = true
   - Subscription = 'pro'
   ```

6. **Day 14 (if no upgrade):**
   ```
   - Cron job runs at 1 AM UTC
   - User downgraded to free
   - hadTrial = true
   - Subscription = 'free'
   ```

### Manual Testing Commands

```powershell
# 1. Create test user (sign up normally or via Prisma Studio)

# 2. Start trial manually
curl http://localhost:3000/api/test/start-trial \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123", "email": "test@example.com"}'

# 3. Trigger reminder emails
curl http://localhost:3000/api/cron/trial-reminders \
  -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# 4. Check trial status
curl http://localhost:3000/api/test/trial-status \
  -X GET \
  -H "Authorization: Bearer user_123"

# 5. Trigger trial expiration
curl http://localhost:3000/api/cron/end-trials \
  -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 9. Monitoring & Analytics

### Key Metrics to Track

```typescript
// Trial conversion rate
const conversionRate = await prisma.auditLog.groupBy({
  by: ['action'],
  where: {
    action: { in: ['trial_started', 'trial_converted'] },
    createdAt: { gte: thirtyDaysAgo },
  },
  _count: true,
});

// Email delivery rate
const emailsSent = await prisma.auditLog.count({
  where: {
    action: { startsWith: 'trial_reminder_' },
    createdAt: { gte: thirtyDaysAgo },
  },
});

// Average time to conversion
const conversions = await prisma.auditLog.findMany({
  where: { action: 'trial_converted' },
  include: {
    user: {
      select: { trialStarted: true },
    },
  },
});

const avgDaysToConversion = conversions.reduce((sum, log) => {
  const started = log.user.trialStarted;
  const converted = log.createdAt;
  const days = (converted - started) / (1000 * 60 * 60 * 24);
  return sum + days;
}, 0) / conversions.length;
```

---

## 🎉 You're All Set!

The trial system is now fully integrated with your authentication and payment flows. Users will automatically:

1. ✅ Start a 14-day Pro trial on sign-up
2. ✅ Receive timely email reminders
3. ✅ Be downgraded if they don't upgrade
4. ✅ Have their conversion tracked in audit logs

For any issues, see `TRIAL_REMINDER_SYSTEM.md` for troubleshooting.
