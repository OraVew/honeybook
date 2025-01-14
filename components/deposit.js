import { useRouter } from 'next/router';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './deposit.css'; // Import the CSS file



const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ formData }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const paymentResponse = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: 2500, // $25 in cents
          bookingDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            startTime: formData.startTime,
            eventType: formData.eventType,
          },
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Payment failed');
      }

      const paymentData = await paymentResponse.json();

      // Send data to Zapier after successful payment
      await fetch('/api/paymentproxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          startTime: formData.startTime,
          eventType: formData.eventType,
          paymentIntentId: paymentData.paymentIntentId,
        }),
      });

      // Notify admin about the paid lead
      const adminNotificationResponse = await fetch('/api/notify-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
        }),
    });

    if (!adminNotificationResponse.ok) {
        throw new Error('Failed to notify admin');
    }

      // Redirect to confirmation page, passing inquiryId
      router.push({
        pathname: '/confirmation',
        query: { inquiryId: formData.inquiryId },
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError('There was an issue processing your payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card-element">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={!stripe || loading} className="submit-button">
        {loading ? 'Processing...' : 'Reserve Now'}
      </button>
    </form>
  );
}

export default function Deposit({ formData }) {
  return (
    <div className="card-container">
      <p className="paragraph">
        We have checked our calendar for your event date, start time, and duration to confirm that we are available.
        <br />
        This is a refundable priority fee that reserves your event until your tour with our venue in person or virtually.
        Once the deposit is received, we will reach out to schedule your tour.
      </p>
      <Elements stripe={stripePromise}>
        <CheckoutForm formData={formData} />
      </Elements>
    </div>
  );
}


