import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };

// Email configuration
export const EMAIL_CONFIG = {
  from: 'AccessCheck <noreply@accesscheck.pro>',
  replyTo: 'contact@accesscheck.pro',
  support: 'contact@accesscheck.pro',
};

// Email templates config
export const TEMPLATES = {
  welcome: {
    subject: 'Welcome to AccessCheck! Your First Scan Awaits 🎯',
  },
  trialReminder: {
    subject: 'Your website could be at risk — Start your 3-day trial',
  },
  trialDay2: {
    subject: (scanCount: number) => `You've scanned ${scanCount} websites — here's what we found`,
  },
  trialEnding: {
    subject: 'Your trial ends in 12 hours - Keep your Pro features',
  },
  weeklyDigest: {
    subject: (issueCount: number) => `Your weekly accessibility report — ${issueCount} issues found`,
  },
  scanComplete: {
    subject: (url: string) => `Scan complete for ${url}`,
  },
};
