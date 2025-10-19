import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { sendWelcomeEmail } from '@/lib/email/templates/welcome';
import { sendTrialStartedEmail } from '@/lib/email/templates/trial-reminders';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: {
    type: string;
    data: {
      id: string;
      email_addresses?: Array<{ id: string; email_address: string }>;
      primary_email_address_id?: string;
      first_name?: string;
      public_metadata?: { trialStartedAt?: string };
    };
  };

  // Verify the webhook signature
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as typeof evt;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the webhook event
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { email_addresses, first_name } = evt.data;

    // Get primary email
    const primaryEmail = email_addresses?.find((email) => email.id === evt.data.primary_email_address_id);
    const email = primaryEmail?.email_address;
    const name = first_name || email?.split('@')[0] || 'there';

    if (email) {
      // Send welcome email
      await sendWelcomeEmail({
        to: email,
        name,
      });

      console.log(`Welcome email sent to ${email}`);
    }
  }

  if (eventType === 'user.updated') {
    const { email_addresses, first_name, public_metadata } = evt.data;

    // Check if user just started a trial
    if (public_metadata?.trialStartedAt) {
      const primaryEmail = email_addresses?.find((email) => email.id === evt.data.primary_email_address_id);
      const email = primaryEmail?.email_address;
      const name = first_name || email?.split('@')[0] || 'there';

      if (email) {
        // Send trial started email
        await sendTrialStartedEmail({
          to: email,
          name,
        });

        console.log(`Trial started email sent to ${email}`);
      }
    }
  }

  return NextResponse.json({ success: true });
}
