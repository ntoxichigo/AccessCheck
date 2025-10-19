import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email/templates/welcome';

// TEST ENDPOINT - Remove after testing
// Visit: http://localhost:3000/api/test-email
// Make sure to add your RESEND_API_KEY to .env.local first!

export async function GET() {
  try {
    // Replace with your actual email for testing
    const result = await sendWelcomeEmail({
      to: 'YOUR_EMAIL@example.com', // ⚠️ CHANGE THIS
      name: 'Test User',
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Welcome email sent successfully!',
        data: result.data,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to send email',
      details: error,
    }, { status: 500 });
  }
}
