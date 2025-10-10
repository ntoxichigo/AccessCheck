# 📧 Email Service Setup Guide (Resend)

**Last Updated:** October 10, 2025  
**Status:** Integrated and Ready

---

## 🎯 Overview

AccessCheck uses [Resend](https://resend.com) for transactional email delivery. This guide will help you set up email functionality for contact forms and notifications.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### Step 2: Get API Key

1. Navigate to [API Keys](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Name it: `AccessCheck Production` or `AccessCheck Development`
4. Copy the API key (starts with `re_`)

### Step 3: Configure Environment Variable

Add to your `.env.local` file:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
CONTACT_EMAIL=your-email@domain.com  # Where contact form submissions go
```

**That's it!** Your contact form will now send real emails! 🎉

---

## 📋 What's Already Set Up

✅ **Contact Form API** - `app/api/contact/route.ts`
- Validates email addresses
- Sends beautifully formatted HTML emails
- Includes sender name and reply-to address
- Logs all submissions with Winston
- Graceful fallback if Resend is not configured

✅ **Email Template Features:**
- Clean, professional HTML design
- Responsive layout
- Sender info and reply-to support
- Timestamp and metadata
- Direct reply functionality

---

## 🆓 Free Tier Limits

Resend's free tier includes:
- **100 emails per day**
- **Unlimited** API requests
- **Unlimited** domains
- All features unlocked

For production apps:
- **Pro Plan:** $20/month - 50,000 emails/month
- **Business Plan:** $80/month - 100,000 emails/month

---

## 🌐 Domain Verification (Optional but Recommended)

For production, you should send emails from your own domain instead of `onboarding@resend.dev`.

### Add Your Domain:

1. Go to [Resend Domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain: `accesscheck.com`
4. Add DNS records to your domain:

```
TXT  @  resend._domainkey  [provided value]
```

5. Wait 24-48 hours for verification
6. Update the "from" field in `app/api/contact/route.ts`:

```typescript
from: 'AccessCheck <noreply@yourdomain.com>',
```

---

## 🧪 Testing Email Delivery

### Development Testing:

```bash
# Send a test email via curl
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

### Check Logs:

```bash
# Watch Winston logs
tail -f logs/all.log | grep "Contact"
```

You should see:
```
✅ Contact form submission logged
✅ Contact email sent successfully
```

---

## 📨 Email Template Preview

When someone submits the contact form, you'll receive:

**Subject:** `Contact Form: [Their Name]`

**Body:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 New Contact Form Submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From: John Doe
Email: john@example.com

─────────────────────────────────
Message:
─────────────────────────────────

I love AccessCheck! Can you help 
me integrate it with my CI/CD 
pipeline?

─────────────────────────────────
💡 Tip: Reply directly to respond
─────────────────────────────────

Sent from AccessCheck • Oct 10, 2025
```

---

## 🔧 Advanced Configuration

### Custom Email Templates

Edit `app/api/contact/route.ts` to customize the email HTML:

```typescript
await resend.emails.send({
  from: 'Your Name <noreply@yourdomain.com>',
  to: process.env.CONTACT_EMAIL,
  replyTo: email,
  subject: `New Message from ${name}`,
  html: `
    <!-- Your custom HTML template -->
  `
});
```

### Add Email Notifications for:

- Scan completion
- Subscription changes
- Account updates
- Weekly reports

### Batch Emails

For sending to multiple recipients:

```typescript
await resend.batch.send([
  { from: '...', to: 'user1@example.com', ... },
  { from: '...', to: 'user2@example.com', ... },
]);
```

---

## 🐛 Troubleshooting

### Email Not Sending?

**Check 1:** Is `RESEND_API_KEY` in `.env.local`?
```bash
echo $RESEND_API_KEY  # Should print: re_xxxxx
```

**Check 2:** Is the API key valid?
- Go to [Resend API Keys](https://resend.com/api-keys)
- Verify key is active
- Check rate limits

**Check 3:** Check Winston logs:
```bash
cat logs/error.log | grep -i resend
```

**Check 4:** Test API key with curl:
```bash
curl https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "youremail@domain.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

### Common Errors:

**"Invalid API key"**
- Double-check your API key
- Make sure it starts with `re_`
- Regenerate key if needed

**"Rate limit exceeded"**
- Free tier: 100 emails/day
- Wait 24 hours or upgrade plan

**"Domain not verified"**
- Use `onboarding@resend.dev` for testing
- Add your domain for production

---

## 📊 Monitoring & Analytics

### Resend Dashboard

View email analytics at [Resend Dashboard](https://resend.com/emails):
- Total emails sent
- Delivery rate
- Bounce rate
- Open rate (if tracking enabled)

### Winston Logs

All email operations are logged:
```bash
# View all contact form submissions
grep "Contact form submission" logs/all.log

# View email send attempts
grep "Contact email sent" logs/all.log

# View email errors
grep "Failed to send contact email" logs/error.log
```

---

## 🔐 Security Best Practices

✅ **Never commit API keys to Git**
- Add `.env.local` to `.gitignore` (already done)
- Use environment variables in production

✅ **Rotate API keys regularly**
- Regenerate every 90 days
- Use separate keys for dev/staging/prod

✅ **Rate limit contact form**
- Already implemented with Upstash Redis
- Max 5 submissions per hour per IP

✅ **Validate all inputs**
- Email validation with regex
- Sanitize message content
- Check required fields

---

## 🚀 Production Deployment

### Vercel Environment Variables:

```bash
# Add in Vercel Dashboard → Settings → Environment Variables
RESEND_API_KEY=re_your_production_key
CONTACT_EMAIL=support@yourdomain.com
```

### Railway/Heroku:

```bash
railway variables set RESEND_API_KEY=re_xxxxx
# or
heroku config:set RESEND_API_KEY=re_xxxxx
```

---

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Node.js SDK](https://github.com/resendlabs/resend-node)
- [Resend Status Page](https://status.resend.com)
- [Email Best Practices](https://resend.com/docs/best-practices)

---

## ✅ Checklist

Before going live, verify:

- [ ] Resend account created
- [ ] API key added to `.env.local`
- [ ] Test email sent successfully
- [ ] Winston logs show "email sent successfully"
- [ ] Domain verified (for production)
- [ ] `from` address updated to your domain
- [ ] Contact form tested end-to-end
- [ ] CONTACT_EMAIL configured
- [ ] Rate limiting working
- [ ] Production env vars set in hosting provider

---

## 🎉 You're All Set!

Your contact form is now fully functional with professional email delivery!

**Test it:** Go to `/contact` and send yourself a test message!

Questions? Check the [Resend Docs](https://resend.com/docs) or our troubleshooting section above.
