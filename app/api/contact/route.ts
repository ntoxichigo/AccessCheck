import { NextResponse } from "next/server";
import { Resend } from "resend";
import { log } from "../../../lib/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Log the contact form submission
    log.info('Contact form submission', { 
      name, 
      email,
      messageLength: message.length 
    });

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'AccessCheck <onboarding@resend.dev>', // In production: 'noreply@yourdomain.com'
          to: process.env.CONTACT_EMAIL || 'support@accesscheck.com',
          replyTo: email,
          subject: `Contact Form: ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;">
                  <strong style="color: #1f2937;">From:</strong> 
                  <span style="color: #4b5563;">${name}</span>
                </p>
                <p style="margin: 0 0 10px 0;">
                  <strong style="color: #1f2937;">Email:</strong> 
                  <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
                </p>
              </div>

              <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <p style="margin: 0 0 10px 0;">
                  <strong style="color: #1f2937;">Message:</strong>
                </p>
                <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">
                  ${message}
                </p>
              </div>

              <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  💡 <strong>Tip:</strong> Reply directly to this email to respond to ${name}
                </p>
              </div>

              <div style="margin-top: 30px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>Sent from AccessCheck Contact Form • ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `,
        });

        log.info('Contact email sent successfully', { name, email });
      } catch (emailError) {
        log.error('Failed to send contact email', { 
          error: emailError instanceof Error ? emailError : new Error(String(emailError)),
          name,
          email
        });
        // Don't fail the request if email fails - still log the contact
      }
    } else {
      log.warn('RESEND_API_KEY not configured - contact form submission logged but email not sent');
    }

    return NextResponse.json({ 
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon." 
    });

  } catch (error) {
    log.error('Contact form error', { 
      error: error instanceof Error ? error : new Error(String(error)) 
    });
    
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
