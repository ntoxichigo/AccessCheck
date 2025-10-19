import { resend, EMAIL_CONFIG, TEMPLATES } from '../resend';

interface SendTrialReminderParams {
  to: string;
  name: string;
  scanCount: number;
  daysLeft: number;
}

// Day 0: Trial Started
export async function sendTrialStartedEmail({ to, name }: { to: string; name: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: TEMPLATES.trialReminder.subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <tr>
                      <td style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Your Pro Trial Starts Now!</h1>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Hi ${name},
                        </p>
                        
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          You've unlocked <strong>unlimited scans</strong> and <strong>professional PDF reports</strong> for the next 3 days. Your website could have critical accessibility issues right now — let's find them.
                        </p>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="https://accesscheck.pro/scan" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                Start Scanning Unlimited Websites →
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-radius: 6px;">
                          <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">Did you know?</h3>
                          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                            71% of users with disabilities will leave a website that's hard to use. Don't lose customers — fix accessibility issues today.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                          AccessCheck Pro Trial - 3 Days Remaining
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send trial started email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending trial started email:', error);
    return { success: false, error };
  }
}

// Day 2: Mid-Trial Reminder
export async function sendTrialMidpointEmail({ to, name, scanCount }: SendTrialReminderParams) {
  const subject = typeof TEMPLATES.trialDay2.subject === 'function' 
    ? TEMPLATES.trialDay2.subject(scanCount) 
    : TEMPLATES.trialDay2.subject;

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <tr>
                      <td style="background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Only 1 Day Left in Your Trial</h1>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Hi ${name},
                        </p>
                        
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          You've scanned <strong>${scanCount} website${scanCount !== 1 ? 's' : ''}</strong> so far. Your Pro trial ends tomorrow at this time.
                        </p>
                        
                        <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%); border-radius: 8px; border: 2px solid #2563eb;">
                          <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; text-align: center;">Keep Your Pro Features</h3>
                          <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                            <li><strong>Unlimited scans</strong> - No daily limits</li>
                            <li><strong>Professional PDF reports</strong> - For clients & compliance</li>
                            <li><strong>Bulk scanning</strong> - Scan entire website domains</li>
                            <li><strong>API access</strong> - Automate your workflow</li>
                          </ul>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center">
                                <a href="https://accesscheck.pro/pricing" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
                                  Upgrade to Pro Now →
                                </a>
                              </td>
                            </tr>
                          </table>
                        </div>
                        
                        <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; text-align: center;">
                          Questions? Reply to this email anytime.
                        </p>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                          AccessCheck Pro Trial - 1 Day Remaining
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send trial midpoint email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending trial midpoint email:', error);
    return { success: false, error };
  }
}

// Day 3: Trial Ending Soon (12 hours before)
export async function sendTrialEndingEmail({ to, name }: { to: string; name: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: TEMPLATES.trialEnding.subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <tr>
                      <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Your Trial Ends in 12 Hours</h1>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Hi ${name},
                        </p>
                        
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          This is your final reminder — your AccessCheck Pro trial expires in <strong>12 hours</strong>.
                        </p>
                        
                        <div style="margin: 30px 0; padding: 25px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626;">
                          <h3 style="margin: 0 0 15px 0; color: #991b1b; font-size: 18px;">What happens after trial ends:</h3>
                          <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 14px; line-height: 1.8;">
                            <li>Back to 1 scan per day</li>
                            <li>No PDF report exports</li>
                            <li>No bulk scanning</li>
                            <li>No API access</li>
                          </ul>
                        </div>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="https://accesscheck.pro/pricing" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                Keep Pro Features - Upgrade Now →
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0 0; color: #4b5563; font-size: 14px; line-height: 1.6; text-align: center;">
                          Don't lose unlimited scanning and PDF reports.<br/>
                          Upgrade before midnight to keep all Pro features.
                        </p>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                          AccessCheck Pro Trial - Expires in 12 Hours
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send trial ending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending trial ending email:', error);
    return { success: false, error };
  }
}
