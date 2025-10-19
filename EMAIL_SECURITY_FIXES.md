# Email Security & Stripe Integration Fixes

## Problem
Users were able to use different email addresses in Stripe checkout than their registered account email, causing subscription mismatches and confusion.

## Solution Overview
Enforced server-side email validation to ensure Stripe subscriptions always use the authenticated user's registered email address.

---

## Changes Made

### 1. **Fixed Cancel Subscription API** (`app/api/billing/cancel/route.ts`)
**Problem:** Was attempting to use `userId` as Stripe customer ID, causing 500 errors.

**Fix:**
- Import Prisma client to fetch user data
- Retrieve user's `stripeCustomerId` from database
- Use correct Stripe customer ID to fetch and cancel subscription
- Added better error logging and details

**Key Changes:**
```typescript
// Before: Incorrect - using userId as customer ID
const subscriptions = await stripe.subscriptions.list({
  customer: userId, // ❌ Wrong!
  ...
});

// After: Correct - fetch from database
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { stripeCustomerId: true },
});
const subscriptions = await stripe.subscriptions.list({
  customer: user.stripeCustomerId, // ✅ Correct!
  ...
});
```

---

### 2. **Secured Checkout Session Creation** (`app/api/billing/create-checkout-session.ts`)
**Problem:** Accepted `email` parameter from client request body, allowing users to supply any email.

**Fix:**
- Added authentication check using `currentUser()` from Clerk
- Fetch email from authenticated user (Clerk) - never trust client input
- Removed `email` parameter from request body
- Use existing Stripe customer if available, otherwise use `customer_email`
- Added `client_reference_id` and metadata to link to internal user ID

**Key Changes:**
```typescript
// Before: Insecure - trusts client-supplied email
const { plan, priceId, email } = body;
const session = await stripe.checkout.sessions.create({
  customer_email: email, // ❌ Can be any email!
  ...
});

// After: Secure - uses authenticated email only
const user = await currentUser();
const userEmail = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress;
const session = await stripe.checkout.sessions.create({
  customer_email: userEmail, // ✅ Authenticated email only!
  client_reference_id: user.id,
  metadata: { userId: user.id, plan },
  ...
});
```

---

### 3. **Updated Stripe Webhook Handler** (`app/api/webhooks/stripe/route.ts`)
**Problem:** No validation that Stripe customer email matches user's registered email.

**Fix:**
- Added email mismatch detection in `handleCheckoutCompleted`
- Logs error if Stripe email doesn't match registered email
- Helps detect and investigate subscription issues

**Key Addition:**
```typescript
if (userId && customerEmail) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (dbUser && dbUser.email.toLowerCase() !== customerEmail.toLowerCase()) {
    log.error("EMAIL MISMATCH DETECTED", {
      userId,
      registeredEmail: dbUser.email,
      stripeEmail: customerEmail,
    });
  }
}
```

---

### 4. **Updated Client Component** (`components/StripeCheckout.tsx`)
**Problem:** Was sending user email in request body to checkout API.

**Fix:**
- Removed email from request body
- Email is now fetched server-side from authenticated session
- Removed unused `useUser` import

**Key Changes:**
```typescript
// Before: Sending email from client
body: JSON.stringify({ 
  plan, 
  email: user?.primaryEmailAddress?.emailAddress // ❌ Unnecessary
})

// After: Server handles email
body: JSON.stringify({ plan }) // ✅ Server-side email only
```

---

### 5. **Trial Start Route** (`app/api/trial/start/route.ts`)
**Already Secure:** This route already correctly uses authenticated email from Clerk:
```typescript
const userEmail = user.emailAddresses?.[0]?.emailAddress || 
                  user.primaryEmailAddress?.emailAddress || 
                  dbUser?.email;
```
✅ No changes needed

---

## Security Benefits

### Before These Changes:
- ❌ Users could enter any email in Stripe checkout
- ❌ Subscriptions might be attached to wrong email
- ❌ Support issues with email mismatches
- ❌ Potential for confusion and billing errors

### After These Changes:
- ✅ Email always fetched from authenticated session
- ✅ No user input for email in any Stripe flow
- ✅ Subscription always linked to correct user account
- ✅ Email mismatch detection and logging
- ✅ Better error handling and debugging

---

## Best Practices Implemented

1. **Never Trust Client Input for Identity**
   - Always use server-side authentication
   - Fetch email from auth provider, not request body

2. **Use Existing Stripe Customers**
   - Check if user has `stripeCustomerId` before creating new customer
   - Reuse customer record to maintain history

3. **Link Stripe to Internal Users**
   - Use `client_reference_id` for user ID
   - Include `userId` in metadata for all Stripe objects
   - Store `stripeCustomerId` in database

4. **Validate and Log**
   - Detect email mismatches in webhooks
   - Log errors for investigation
   - Include context in all log messages

5. **Consistent Email Source**
   - Clerk is the source of truth for user email
   - Database email is fallback
   - Never accept email from client requests

---

## Testing Checklist

- [ ] Start new trial - verify correct email used in Stripe
- [ ] Upgrade to Pro - verify correct email used in Stripe
- [ ] Cancel subscription - verify cancel API works
- [ ] Check Stripe dashboard - verify customer email matches app email
- [ ] Review logs - verify no email mismatch warnings
- [ ] Test with multiple users - verify each uses their own email

---

## Database Schema Reference

```prisma
model User {
  id               String   @id @default(cuid())
  email            String   @unique
  stripeCustomerId String?  @unique  // ← Links to Stripe customer
  subscription     String   @default("free")
  trialStarted     DateTime?
  trialEnds        DateTime?
  hadTrial         Boolean  @default(false)
  ...
}
```

---

## Error Resolution

### Cancel Subscription 500 Error
**Cause:** Route was using `userId` as Stripe customer ID

**Fixed:** Now fetches `stripeCustomerId` from database

**Test:** Cancel button should work without 500 errors

---

## Future Improvements

1. Add email verification before allowing subscription creation
2. Send confirmation email when subscription is activated
3. Add admin panel to view and fix email mismatches
4. Implement customer portal for self-service subscription management
5. Add webhook to sync email changes from Clerk to Stripe

---

## Questions?
If you encounter any issues with subscriptions or email mismatches:
1. Check the logs for "EMAIL MISMATCH DETECTED" messages
2. Verify user has `stripeCustomerId` in database
3. Check Stripe dashboard for customer details
4. Review webhook logs for event processing

---

**Date:** 2025-10-17  
**Status:** ✅ Complete  
**Impact:** High - Prevents subscription/email mismatches for all future users
