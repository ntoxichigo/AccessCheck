import { resend, EMAIL_CONFIG, TEMPLATES } from '../resend';

interface SendWelcomeEmailParams {
  to: string;
  name: string;
}

export async function sendWelcomeEmail({ to, name }: SendWelcomeEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: TEMPLATES.welcome.subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to AccessCheck</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">AccessCheck</h1>
                        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">WCAG Compliance Made Simple</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">Welcome, ${name}!</h2>
                        
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Thanks for joining AccessCheck! You're now ready to scan any website for WCAG 2.1 compliance issues and ensure your web properties are accessible to everyone.
                        </p>
                        
                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="https://accesscheck.pro/scan" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                Scan Your First Website →
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Features -->
                        <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #2563eb;">
                          <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">What you get for free:</h3>
                          <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                            <li>1 scan per day</li>
                            <li>Detailed accessibility reports</li>
                            <li>WCAG 2.1 compliance checking</li>
                            <li>Scan history tracking</li>
                          </ul>
                        </div>
                        
                        <!-- Tip -->
                        <div style="margin: 30px 0; padding: 15px; background-color: #fef3c7; border-radius: 6px;">
                          <p style="margin: 0; color: #92400e; font-size: 14px;">
                            <strong>💡 Pro Tip:</strong> 98% of websites have accessibility issues. Start your Pro trial to scan unlimited websites and export professional PDF reports.
                          </p>
                        </div>
                        
                        <p style="margin: 30px 0 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Need help? Reply to this email or visit our <a href="https://accesscheck.pro/contact" style="color: #2563eb; text-decoration: none;">support page</a>.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                          AccessCheck - Web Accessibility Compliance Platform
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                          Powered by axe-core™ | Industry Standard for Accessibility Testing
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
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}
