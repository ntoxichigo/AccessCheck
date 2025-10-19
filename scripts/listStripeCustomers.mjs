import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
});

async function listCustomers() {
  try {
    // List recent customers
    const customers = await stripe.customers.list({ limit: 10 });
    console.log('Recent Stripe Customers:');
    customers.data.forEach(c => {
      console.log(`ID: ${c.id}, Email: ${c.email}, Created: ${new Date(c.created * 1000).toISOString()}`);
      if (c.metadata && Object.keys(c.metadata).length) {
        console.log('  Metadata:', c.metadata);
      }
    });
  } catch (err) {
    console.error('Error listing customers:', err);
    process.exit(1);
  }
}

listCustomers();
