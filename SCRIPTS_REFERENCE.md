# 🛠️ AccessCheck Scripts Reference

This document lists all available npm scripts and their purposes.

## 📦 Package Scripts

### Development & Build
```bash
npm run dev          # Start Next.js development server with Turbopack
npm run build        # Build for production (runs prisma generate first)
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🗄️ Database Scripts

### User Management
```bash
# List all users in database
npm run db:list-users

# Create/sync user from Stripe customer
npm run db:create-user <clerkUserId> <stripeCustomerId>
# Example: npm run db:create-user user_abc123 cus_xyz789

# Update user email and link to Stripe
npm run db:update-user-email <userId> <email> <stripeCustomerId>
# Example: npm run db:update-user-email user_abc123 john@example.com cus_xyz789

# Fix trial status (corrects trial/pro/free status)
npm run db:fix-trial <userId>
# Example: npm run db:fix-trial user_abc123
```

---

## 💳 Stripe Scripts

### Customer Management
```bash
# List recent Stripe customers
npm run stripe:list-customers

# Sync trial subscription from Stripe to database
npm run stripe:sync-trial <stripeCustomerId>
# Example: npm run stripe:sync-trial cus_xyz789
```

---

## 📋 Common Use Cases

### New User Sign-Up Issue
If a user signs up but doesn't appear in the database:
```bash
# 1. Get their Clerk user ID from the app logs or Clerk Dashboard
# 2. Check if they have a Stripe customer
npm run stripe:list-customers

# 3. Create user record
npm run db:create-user <clerkUserId> <stripeCustomerId>
```

### Trial Status Mismatch
If a user's trial status is incorrect (showing "pro" instead of "trial"):
```bash
# 1. List users to find the user ID
npm run db:list-users

# 2. Fix their trial status
npm run db:fix-trial <userId>
```

### Sync Existing Stripe Trial
If a trial exists in Stripe but not in the database:
```bash
# 1. Get customer ID from Stripe Dashboard
# 2. Sync the trial
npm run stripe:sync-trial <stripeCustomerId>
```

### Debug Subscription Issues
```bash
# 1. Check database status
npm run db:list-users

# 2. Check Stripe status
npm run stripe:list-customers

# 3. If mismatch, sync or fix
npm run db:fix-trial <userId>
```

---

## 🔍 Script Locations

All scripts are located in the `scripts/` directory:
- `listAllUsers.mjs` - List database users
- `createUserFromStripe.mjs` - Create user from Stripe data
- `updateUserEmail.mjs` - Update user email
- `fixTrialStatus.mjs` - Fix trial status
- `listStripeCustomers.mjs` - List Stripe customers
- `syncTrialFromStripe.mjs` - Sync trial from Stripe

---

## ⚙️ Environment Variables Required

Make sure these are set in your `.env` or `.env.local`:
```env
STRIPE_SECRET_KEY=sk_...
DATABASE_URL=postgresql://...
```

---

## 🚨 Important Notes

1. **Always backup** before running database modification scripts
2. **Check production** carefully - these scripts affect live data
3. **User IDs** start with `user_` (from Clerk)
4. **Customer IDs** start with `cus_` (from Stripe)
5. Scripts use ES modules (`.mjs` extension)
6. All scripts require valid environment variables

---

## 📞 Support

If you encounter issues:
1. Check the terminal output for error messages
2. Verify environment variables are set
3. Ensure database and Stripe connections are working
4. Check script logs in the terminal

---

*Last updated: October 18, 2025*
