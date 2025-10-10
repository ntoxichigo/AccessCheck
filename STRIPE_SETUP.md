# Stripe Integration Setup Guide

## Overview
This project uses Stripe for subscription billing with two paid plans: **Pro** and **Business**.

## Plans

### Free Plan
- **Price**: $0
- **Features**: 
  - 1 scan per account
  - Summary report
  - Basic WCAG checks
  - No export

### Pro Plan
- **Price**: $19/month
- **Features**:
  - Unlimited scans
  - Full accessibility reports
  - WCAG 2.1 AA/AAA mapping
  - CSV/JSON export
  - Priority support

### Business Plan
- **Price**: Custom pricing
- **Features**:
  - Team seats (5+)
  - Dedicated SLA
  - Custom integrations
  - Audit trail & compliance
  - Enterprise support

## Setup Instructions

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from the Stripe Dashboard

### 2. Create Products & Prices in Stripe

#### Pro Plan
1. In Stripe Dashboard, go to **Products** → **Add Product**
2. Product name: `AccessCheck Pro`
3. Description: `Unlimited accessibility scans with full reports`
4. Pricing:
   - Type: **Recurring**
   - Price: **$19.00**
   - Billing period: **Monthly**
5. Click **Save product**
6. Copy the **Price ID** (starts with `price_`)

#### Business Plan
1. Create another product: `AccessCheck Business`
2. Description: `Enterprise accessibility scanning for teams`
3. Pricing: **Custom** (handled via contact sales)
4. Copy the **Price ID**

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_xxxxx  # From Stripe Dashboard → Developers → API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Stripe Price IDs (from step 2 above)
STRIPE_PRICE_ID_PRO=price_xxxxx  # Pro plan Price ID
STRIPE_PRICE_ID_BUSINESS=price_xxxxx  # Business plan Price ID

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Update for production
```

### 4. Configure Webhooks (Optional but Recommended)

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### 5. Test the Integration

1. Use Stripe test mode (API keys starting with `sk_test_` and `pk_test_`)
2. Test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`
3. Use any future expiry date (e.g., 12/34)
4. Use any 3-digit CVC

### 6. Production Deployment

1. Switch to **Live mode** in Stripe Dashboard
2. Update `.env.local` with live API keys (starting with `sk_live_` and `pk_live_`)
3. Update `NEXT_PUBLIC_BASE_URL` to your production domain
4. Enable webhooks for production endpoint
5. Test with real payment methods

## API Endpoints

- **POST** `/api/billing/create-checkout-session` - Creates a Stripe Checkout session
- **POST** `/api/billing/activate-pro` - Demo activation (development only)
- **POST** `/api/webhooks/stripe` - Handles Stripe webhook events (to be implemented)

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive keys
- Always use Stripe test mode during development
- Implement webhook signature verification for production
- Store subscription status in your database

## Support

For issues with Stripe integration:
1. Check [Stripe Documentation](https://stripe.com/docs)
2. Review Stripe Dashboard logs
3. Check browser console for client-side errors
4. Check server logs for API errors
