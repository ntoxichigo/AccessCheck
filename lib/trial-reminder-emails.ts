/**
 * Trial Reminder Email System
 * Sends automated reminders to trial users at critical points
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface TrialEmailData {
  userName: string;
  userEmail: string;
  daysRemaining: number;
  trialEndsDate: string;
}

/**
 * Day 7 Reminder - Halfway through trial
 */
export async function sendTrialDay7Email(data: TrialEmailData) {
  try {
    const { userName, userEmail, daysRemaining } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .header p {
      margin: 10px 0 0;
      opacity: 0.95;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .highlight-box {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 25px 0;
      border-radius: 8px;
    }
    .highlight-box .days {
      font-size: 48px;
      font-weight: bold;
      color: #667eea;
      margin: 0;
      line-height: 1;
    }
    .highlight-box .label {
      font-size: 16px;
      color: #666;
      margin: 5px 0 0;
    }
    .benefits {
      margin: 30px 0;
    }
    .benefit-item {
      display: flex;
      align-items: start;
      margin: 15px 0;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .benefit-item .icon {
      font-size: 24px;
      margin-right: 15px;
      flex-shrink: 0;
    }
    .benefit-item .text {
      flex: 1;
    }
    .benefit-item h3 {
      margin: 0 0 5px;
      font-size: 16px;
      color: #333;
    }
    .benefit-item p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    .cta {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>♿ AccessCheck Pro Trial</h1>
      <p>You're halfway there!</p>
    </div>
    
    <div class="content">
      <p>Hi ${userName},</p>
      
      <p>You're doing great! You started your Pro trial <strong>7 days ago</strong>, and we wanted to check in and remind you of all the powerful features at your fingertips.</p>
      
      <div class="highlight-box">
        <div class="days">${daysRemaining}</div>
        <div class="label">days remaining in your trial</div>
      </div>
      
      <h2 style="color: #333; font-size: 20px; margin: 30px 0 20px;">Make the Most of Your Trial:</h2>
      
      <div class="benefits">
        <div class="benefit-item">
          <div class="icon">🔍</div>
          <div class="text">
            <h3>Unlimited Scans</h3>
            <p>Run comprehensive accessibility audits on all your pages</p>
          </div>
        </div>
        
        <div class="benefit-item">
          <div class="icon">📄</div>
          <div class="text">
            <h3>PDF Export</h3>
            <p>Generate professional reports for clients and stakeholders</p>
          </div>
        </div>
        
        <div class="benefit-item">
          <div class="icon">💡</div>
          <div class="text">
            <h3>Code Fix Snippets</h3>
            <p>Get copy-paste code examples to fix issues fast</p>
          </div>
        </div>
        
        <div class="benefit-item">
          <div class="icon">📊</div>
          <div class="text">
            <h3>Historical Tracking</h3>
            <p>Monitor your compliance progress over time</p>
          </div>
        </div>
      </div>
      
      <p><strong>Quick tip:</strong> Try scanning multiple pages to see how AccessCheck helps you maintain compliance across your entire site!</p>
      
      <div class="cta">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">
          Continue Using Pro Features →
        </a>
      </div>
      
      <p style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb; color: #666; font-size: 14px;">
        Your trial will automatically convert to the <strong>Pro plan at $19/month</strong> on ${data.trialEndsDate} unless you cancel. You can manage your subscription anytime in your dashboard.
      </p>
    </div>
    
    <div class="footer">
      <p>Questions? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact">Help Center</a></p>
      <p style="margin-top: 15px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/settings">Manage Subscription</a> · 
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    await resend.emails.send({
      from: 'AccessCheck <noreply@accesscheck.com>',
      to: userEmail,
      subject: `🎯 Halfway through your Pro trial - ${daysRemaining} days left!`,
      html,
    });

    console.log(`✅ Day 7 trial reminder sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send day 7 trial email:', error);
    return { success: false, error };
  }
}

/**
 * Day 12 Reminder - 2 days left
 */
export async function sendTrialDay12Email(data: TrialEmailData) {
  try {
    const { userName, userEmail, trialEndsDate } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 40px 30px;
    }
    .urgency-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-left: 4px solid #f59e0b;
      padding: 25px;
      margin: 25px 0;
      border-radius: 8px;
      text-align: center;
    }
    .urgency-box .timer {
      font-size: 56px;
      font-weight: bold;
      color: #f59e0b;
      margin: 0;
      line-height: 1;
    }
    .urgency-box .label {
      font-size: 18px;
      color: #92400e;
      margin: 10px 0 0;
      font-weight: 600;
    }
    .pricing-card {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-radius: 12px;
      padding: 30px;
      margin: 25px 0;
      text-align: center;
    }
    .pricing-card .price {
      font-size: 48px;
      font-weight: bold;
      color: #667eea;
      margin: 10px 0;
    }
    .pricing-card .period {
      font-size: 18px;
      color: #666;
      margin-bottom: 20px;
    }
    .pricing-card .features {
      text-align: left;
      margin: 20px 0;
    }
    .pricing-card .feature {
      display: flex;
      align-items: center;
      margin: 10px 0;
      font-size: 15px;
    }
    .pricing-card .feature .check {
      color: #10b981;
      margin-right: 10px;
      font-size: 20px;
    }
    .cta {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 18px 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 18px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
    }
    .secondary-button {
      display: inline-block;
      padding: 12px 30px;
      color: #667eea;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      margin-top: 15px;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Your Pro Trial is Ending Soon</h1>
    </div>
    
    <div class="content">
      <p>Hi ${userName},</p>
      
      <p>Your Pro trial is almost over! In just <strong>2 days</strong>, your trial will end and you'll be automatically subscribed to Pro.</p>
      
      <div class="urgency-box">
        <div class="timer">2</div>
        <div class="label">Days Left in Your Trial</div>
      </div>
      
      <h2 style="color: #333; font-size: 22px; margin: 30px 0 20px; text-align: center;">Continue with AccessCheck Pro</h2>
      
      <div class="pricing-card">
        <div class="price">$19</div>
        <div class="period">per month</div>
        
        <div class="features">
          <div class="feature">
            <span class="check">✓</span>
            <span>10 scans per day (not per month!)</span>
          </div>
          <div class="feature">
            <span class="check">✓</span>
            <span>Full accessibility reports</span>
          </div>
          <div class="feature">
            <span class="check">✓</span>
            <span>PDF export for stakeholders</span>
          </div>
          <div class="feature">
            <span class="check">✓</span>
            <span>Priority email support</span>
          </div>
          <div class="feature">
            <span class="check">✓</span>
            <span>Code fix snippets</span>
          </div>
          <div class="feature">
            <span class="check">✓</span>
            <span>Historical tracking</span>
          </div>
        </div>
      </div>
      
      <p style="text-align: center; font-size: 16px; color: #666;">
        <strong>No action needed!</strong> Your Pro subscription will automatically start on <strong>${trialEndsDate}</strong>.
      </p>
      
      <div class="cta">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/settings" class="button">
          View Subscription Details
        </a>
        <br>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/settings" class="secondary-button">
          Cancel if not interested
        </a>
      </div>
      
      <p style="margin-top: 40px; padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong>💚 Love AccessCheck?</strong> Consider our annual plan and <strong>save 20%</strong> ($144/year instead of $180).
      </p>
    </div>
    
    <div class="footer">
      <p>Questions about billing? <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact">Contact our support team</a></p>
      <p style="margin-top: 15px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/settings">Manage Subscription</a> · 
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pricing">View Plans</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    await resend.emails.send({
      from: 'AccessCheck <noreply@accesscheck.com>',
      to: userEmail,
      subject: `⏰ 2 days left in your Pro trial`,
      html,
    });

    console.log(`✅ Day 12 trial reminder sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send day 12 trial email:', error);
    return { success: false, error };
  }
}

/**
 * Day 13 Reminder - Last day!
 */
export async function sendTrialDay13Email(data: TrialEmailData) {
  try {
    const { userName, userEmail, trialEndsDate } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
    }
    .header .emoji {
      font-size: 64px;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px 30px;
    }
    .final-notice {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      border: 3px solid #dc2626;
      border-radius: 12px;
      padding: 30px;
      margin: 25px 0;
      text-align: center;
    }
    .final-notice .title {
      font-size: 24px;
      font-weight: bold;
      color: #991b1b;
      margin: 0 0 15px;
    }
    .final-notice .date {
      font-size: 20px;
      color: #dc2626;
      font-weight: 600;
    }
    .action-buttons {
      text-align: center;
      margin: 35px 0;
    }
    .button-primary {
      display: inline-block;
      padding: 20px 60px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 18px;
      box-shadow: 0 6px 25px rgba(16, 185, 129, 0.5);
      margin-bottom: 15px;
    }
    .button-secondary {
      display: inline-block;
      padding: 16px 40px;
      background: white;
      color: #dc2626;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      border: 2px solid #dc2626;
    }
    .testimonial {
      background: #f9fafb;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 30px 0;
      border-radius: 8px;
      font-style: italic;
    }
    .testimonial .author {
      font-style: normal;
      font-weight: 600;
      color: #667eea;
      margin-top: 10px;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="emoji">⚡</div>
      <h1>Last Day of Your Pro Trial!</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px;">Hi ${userName},</p>
      
      <p style="font-size: 16px;">This is it — your Pro trial ends <strong>tomorrow</strong> (${trialEndsDate}).</p>
      
      <div class="final-notice">
        <div class="title">🚨 Final Notice</div>
        <p style="margin: 10px 0; color: #991b1b; font-size: 16px;">
          Your subscription will automatically start at <strong>$19/month</strong> tomorrow unless you cancel today.
        </p>
        <div class="date">${trialEndsDate}</div>
      </div>
      
      <h2 style="color: #333; font-size: 22px; margin: 35px 0 20px; text-align: center;">Choose Your Next Step:</h2>
      
      <div class="action-buttons">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button-primary">
          ✓ Keep Pro - Start Billing
        </a>
        <br>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/settings" class="button-secondary">
          Cancel Subscription
        </a>
      </div>
      
      <div class="testimonial">
        <p>"AccessCheck Pro saved us hours of manual testing. The code snippets alone are worth the subscription. We're catching issues before they become lawsuits."</p>
        <div class="author">— Sarah M., Lead Developer at TechCorp</div>
      </div>
      
      <h3 style="color: #333; margin: 30px 0 15px;">What You'll Keep with Pro ($19/mo):</h3>
      <ul style="line-height: 2; color: #666;">
        <li>✅ <strong>10 scans every single day</strong> (not per month!)</li>
        <li>✅ <strong>Unlimited pages</strong> scanned per scan</li>
        <li>✅ <strong>Professional PDF reports</strong></li>
        <li>✅ <strong>Priority support</strong> (response in &lt; 24hrs)</li>
        <li>✅ <strong>Code fix snippets</strong> with examples</li>
        <li>✅ <strong>Historical tracking</strong> of improvements</li>
      </ul>
      
      <p style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 30px 0;">
        <strong>💰 Want to save?</strong> Switch to our annual plan and pay <strong>$144/year</strong> instead of $180. That's <strong>$36 saved</strong>!
      </p>
      
      <p style="text-align: center; font-size: 14px; color: #999; margin-top: 40px;">
        No hard feelings if you need to cancel — we'll still be here if you need us in the future! 💙
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Need help deciding?</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact">Chat with our team</a></p>
      <p style="margin-top: 15px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/settings">Manage Subscription</a> · 
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pricing">Compare Plans</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    await resend.emails.send({
      from: 'AccessCheck <noreply@accesscheck.com>',
      to: userEmail,
      subject: `🚨 Last day of your Pro trial - Action required`,
      html,
    });

    console.log(`✅ Day 13 trial reminder sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send day 13 trial email:', error);
    return { success: false, error };
  }
}

/**
 * Welcome Email - Sent when trial starts
 */
export async function sendTrialWelcomeEmail(data: TrialEmailData) {
  try {
    const { userName, userEmail, trialEndsDate } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 50px 30px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 32px;
    }
    .content {
      padding: 40px 30px;
    }
    .welcome-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 30px 0;
    }
    .feature-list li {
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
    }
    .feature-list li:before {
      content: '✓';
      display: inline-block;
      width: 24px;
      height: 24px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 24px;
      margin-right: 12px;
      font-weight: bold;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to AccessCheck Pro!</h1>
    </div>
    
    <div class="content">
      <span class="welcome-badge">14-DAY FREE TRIAL</span>
      
      <p>Hi ${userName},</p>
      
      <p>Welcome aboard! Your 14-day Pro trial has officially started. You now have access to all Pro features to help make your websites accessible to everyone.</p>
      
      <p style="font-size: 18px; font-weight: 600; color: #667eea; margin: 30px 0;">
        Your trial ends on ${trialEndsDate}
      </p>
      
      <h2>What you can do now:</h2>
      <ul class="feature-list">
        <li>Run up to 10 accessibility scans per day</li>
        <li>Get detailed WCAG 2.1 compliance reports</li>
        <li>Download PDF reports for stakeholders</li>
        <li>Access code snippets to fix issues</li>
        <li>Track scan history and progress</li>
        <li>Priority email support</li>
      </ul>
      
      <center>
        <a href="https://accesscheck.com/dashboard" class="cta-button">
          Start Your First Scan →
        </a>
      </center>
      
      <h3 style="margin-top: 40px;">Getting Started Tips:</h3>
      <ol>
        <li><strong>Run a test scan</strong> - Try scanning your website to see what issues exist</li>
        <li><strong>Review the report</strong> - Each issue includes severity level and how to fix it</li>
        <li><strong>Use code snippets</strong> - Copy-paste ready code to fix common issues</li>
        <li><strong>Track progress</strong> - Re-scan to measure improvements over time</li>
      </ol>
      
      <p style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-left: 4px solid #667eea; border-radius: 4px;">
        <strong>💡 Pro Tip:</strong> Focus on critical violations first - these have the biggest impact on user experience and often account for 80% of accessibility barriers.
      </p>
      
      <h3>Need Help?</h3>
      <p>Our team is here to support you:</p>
      <ul>
        <li>📧 Email us at <a href="mailto:support@accesscheck.com">support@accesscheck.com</a></li>
        <li>📚 Check our <a href="https://accesscheck.com/docs">documentation</a></li>
        <li>💬 Live chat available in your dashboard</li>
      </ul>
      
      <p>We're excited to help you create a more accessible web!</p>
      
      <p>Best regards,<br>
      The AccessCheck Team</p>
    </div>
    
    <div class="footer">
      <p>You're receiving this email because you started a trial with AccessCheck.</p>
      <p>AccessCheck - Making the web accessible for everyone</p>
      <p><a href="https://accesscheck.com">accesscheck.com</a></p>
    </div>
  </div>
</body>
</html>
`;

    await resend.emails.send({
      from: 'AccessCheck <noreply@accesscheck.com>',
      to: userEmail,
      subject: `🎉 Welcome to your 14-day Pro trial!`,
      html,
    });

    console.log(`✅ Welcome email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error };
  }
}
