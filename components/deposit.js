import { useRouter } from 'next/router';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './deposit.css'; // Import the CSS file

// Load Stripe outside of a component's render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ name, email, phone, startTime, eventType, formData }) {
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
          name,
          email,
          phone,
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
          amount: 2500, // $10 in cents
          bookingDetails: { name, email, phone, startTime, eventType },
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Payment failed');
      }

      const paymentData = await paymentResponse.json();

      // After successful payment, send data to Zapier through the proxy including paymentIntentId
      await fetch('/api/paymentproxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          startTime,
          eventType,
          paymentIntentId: paymentData.paymentIntentId,
        }),
      });

      

      // Redirect to confirmation page upon successful payment, passing only the inquiryId
    router.push({
      pathname: '/confirmation',
      query: {
        inquiryId: formData.inquiryId, // Pass only inquiryId
      },
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
      <button
        type="submit"
        disabled={!stripe || loading}
        className="submit-button"
      >
        {loading ? 'Processing...' : 'Reserve Now'}
      </button>
    </form>
  );
}

export default function Deposit({ formData }) {
  const router = useRouter();
  const { name, email, phone, startTime, eventType } = router.query;

  return (
   
      <div className="card-container">
        <p className="paragraph">
          We have checked our calendar for your event date, start time, and duration to confirm that we are available.
          <br />
          This is a refundable priority fee that reserves your event until your tour with our venue in person or virtually. We operate on a first-come, first-served basis. Ensure no one else can book it while you’re deciding. Once the deposit is received, we will reach out to schedule your tour.
        </p>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            name={name}
            email={email}
            phone={phone}
            startTime={startTime}
            eventType={eventType}
            formData={formData}
          />
        </Elements>
      </div>
  
  );
}

