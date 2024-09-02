import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { paymentMethodId, amount, bookingDetails } = req.body;

      // Create a Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method: paymentMethodId,
        description: `Deposit for ${bookingDetails.eventType} on ${new Date(bookingDetails.startTime).toLocaleString('en-US', { timeZone: 'America/Chicago' })}`,
        receipt_email: bookingDetails.email,
        confirm: true,
        return_url: process.env.NEXT_PUBLIC_CONFIRMATION_URL, // Use environment variable
      });

      res.status(200).json({ success: true, paymentIntentId: paymentIntent.id });
    } catch (error) {
      console.error('Payment processing error:', error);
      res.status(500).json({ error: 'Payment failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

