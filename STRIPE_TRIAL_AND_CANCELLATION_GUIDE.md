# Stripe Trial & Subscription Management Guide

## ✅ Fixed Issues Summary

### 1. Trial System Now Connected to Stripe
**Before:** Trial was a simple database flag - users could activate without payment method
**After:** Trial goes through Stripe Checkout - requires payment method, auto-charges after 3 days

### 2. Hydration Error Fixed
**Before:** `useSearchParams()` causing hydration mismatch in sign-in/sign-up pages
**After:** Wrapped in `Suspense` boundary to prevent SSR/client mismatch

---

## 🎯 How the New Trial System Works

### User Flow:
1. **User clicks "Start 3-Day Trial"** → Frontend calls `/api/trial/start`
2. **API creates Stripe Checkout Session** with:
   - `trial_period_days: 3`
   - Payment method required (card on file)
   - Success URL: `/dashboard?trial=started`
   - Cancel URL: `/pricing?trial=canceled`

3. **User enters payment details in Stripe**
   - Stripe validates the card
   - No charge happens immediately
   - Card is stored securely by Stripe

4. **Stripe webhook fires: `checkout.session.completed`**
   - Updates user subscription to 'pro'
   - Sets trial start/end dates
   - Logs trial activation

5. **User has 3 days of Pro access**
   - Full Pro features available
   - Can cancel anytime
   - Reminder emails sent (days 1, 2, before charge)

6. **After 3 days:**
   - **If not canceled:** Stripe automatically charges the card ($19)
   - **If canceled:** Subscription ends, user downgrades to free tier

---

## 📝 Code Changes Made

### 1. Trial Start Endpoint (`app/api/trial/start/route.ts`)
```typescript
// Now creates Stripe Checkout Session instead of direct database update
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  subscription_data: {
    trial_period_days: 3, // 3-day trial
  },
  success_url: `/dashboard?trial=started`,
  cancel_url: `/pricing?trial=canceled`,
});

return { checkoutUrl: session.url }; // Redirect user to Stripe
```

### 2. Sign-In/Sign-Up Pages (Hydration Fix)
```typescript
// Wrapped useSearchParams() in Suspense to fix hydration
function SignInForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';
  // ... rest of component
}

export default function SignInPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignInForm />
    </Suspense>
  );
}
```

---

## 🔧 Subscription Management Features

### ✅ Already Implemented

#### 1. **Cancellation** (`/api/billing/cancel`)
- Cancel at period end (not immediately)
- User keeps access until billing period ends
- Logs cancellation reason
- Updates Stripe subscription

**Frontend Usage:**
```typescript
const handleCancel = async () => {
  const res = await fetch('/api/billing/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason: 'User feedback here' }),
  });
  
  if (res.ok) {
    alert('Subscription will cancel at period end');
  }
};
```

#### 2. **Reactivation** (`/api/billing/reactivate`)
- Reactivate a canceled subscription before period ends
- Removes `cancel_at_period_end` flag

#### 3. **Webhook Handling** (`/api/webhooks/stripe`)
Handles all Stripe events:
- `checkout.session.completed` - New subscription/trial started
- `customer.subscription.created` - Subscription activated
- `customer.subscription.updated` - Plan changed or renewed
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed (retry logic in Stripe)

---

## 💳 Stripe Customer Portal

Stripe provides a **pre-built Customer Portal** where users can:
- View subscription details
- Update payment method
- View invoices
- Cancel subscription
- Download receipts

### How to Enable:
1. **In Stripe Dashboard:**
   - Settings → Billing → Customer Portal
   - Enable features you want (cancel, update payment, etc.)
   - Set cancellation behavior (immediate vs. end of period)

2. **Create Portal Session API:**
```typescript
// app/api/billing/portal/route.ts (CREATE THIS)
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const { userId } = await auth();
  
  // Get user's Stripe customer ID from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });
  
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  });
  
  return NextResponse.json({ url: session.url });
}
```

3. **Frontend Button:**
```tsx
<button onClick={async () => {
  const res = await fetch('/api/billing/portal', { method: 'POST' });
  const { url } = await res.json();
  window.location.href = url;
}}>
  Manage Subscription
</button>
```

---

## 💰 Refund Policy (Your Question)

### Is Refund Feature Required?
**No**, it's **100% optional**. Here's why:

1. **Stripe automatically handles disputes** - If a customer disputes a charge, Stripe notifies you
2. **Manual refunds are fine** - You can issue refunds through Stripe Dashboard
3. **Most SaaS apps don't automate refunds** - They handle case-by-case via support

### If You Want to Add Refunds (Optional):
```typescript
// app/api/billing/refund/route.ts
export async function POST(req: Request) {
  const { userId } = await auth();
  const { reason } = await req.json();
  
  // Get latest charge
  const charges = await stripe.charges.list({
    customer: stripeCustomerId,
    limit: 1,
  });
  
  // Refund
  const refund = await stripe.refunds.create({
    charge: charges.data[0].id,
    reason: 'requested_by_customer',
    metadata: { userId, reason },
  });
  
  return NextResponse.json({ refund });
}
```

### Recommended Refund Policy:
- **Trial period**: Full refund within 7 days
- **After trial**: No automated refunds (manual review)
- **Disputes**: Handled by Stripe automatically

---

## 🚀 Next Steps to Complete Integration

### 1. Update Frontend Trial Button
```tsx
// In your pricing page or trial banner
const handleStartTrial = async () => {
  const res = await fetch('/api/trial/start', { method: 'POST' });
  const data = await res.json();
  
  if (data.checkoutUrl) {
    // Redirect to Stripe Checkout
    window.location.href = data.checkoutUrl;
  } else {
    alert(data.error);
  }
};
```

### 2. Add "Manage Subscription" Button
```tsx
// In settings or dashboard
<button onClick={async () => {
  const res = await fetch('/api/billing/portal', { method: 'POST' });
  const { url } = await res.json();
  window.location.href = url;
}}>
  Manage Subscription
</button>
```

### 3. Set Stripe Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_BUSINESS=price_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000 (or your domain)
```

### 4. Test the Flow
1. Start trial → Should redirect to Stripe
2. Enter test card (4242 4242 4242 4242)
3. Verify webhook updates database
4. Wait 3 days (or use Stripe CLI to simulate time travel)
5. Verify auto-charge happens
6. Test cancellation

---

## 🧪 Testing with Stripe CLI

```bash
# Install Stripe CLI
stripe login

# Listen to webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
```

---

## ✅ Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Trial requires payment method | ✅ Fixed | Now goes through Stripe Checkout |
| 3-day trial period | ✅ Configured | `trial_period_days: 3` |
| Auto-charge after trial | ✅ Works | Stripe handles automatically |
| Cancellation | ✅ Implemented | `/api/billing/cancel` |
| Reactivation | ✅ Implemented | `/api/billing/reactivate` |
| Webhook handling | ✅ Complete | All events handled |
| Customer Portal | ⚠️ TODO | Need to create portal route |
| Refunds | ❌ Optional | Not required - handle manually |

---

## 📞 Support & Questions

**Q: What if a user's payment fails after trial?**
A: Stripe will retry automatically. After retries fail, webhook fires `customer.subscription.deleted` and user is downgraded to free.

**Q: Can users change plans?**
A: Yes - create a new checkout session with different price ID, or use Customer Portal.

**Q: Do I need to handle refunds in code?**
A: No - you can handle manually via Stripe Dashboard on case-by-case basis.

**Q: How do I test without waiting 3 days?**
A: Use Stripe CLI to trigger time-based events or set trial to 1 minute for testing.
