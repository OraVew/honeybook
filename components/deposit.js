import { useRouter } from 'next/router';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './deposit.css'; // Import the CSS file

// Load Stripe outside of a component's render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ name, email, phone, pricingOption, startTime, eventType }) {
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
  
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: 1000, // $10 in cents
          bookingDetails: { name, email, phone, pricingOption, startTime, eventType },
        }),
      });
  
      if (!response.ok) {
        throw new Error('Payment failed');
      }
  
      // Redirect to confirmation page upon successful payment, passing the details as query parameters
      router.push({
        pathname: '/confirmation',
        query: {
          name,
          email,
          phone,
          pricingOption,
          startTime,
          eventType,
        },
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError('There was an issue processing your payment. Please try again.');
      setLoading(false);
    }
  };
  

  const handleVirtualTour = () => {
    router.push({
      pathname: '/virtualtour',
      query: {
        name,
        email,
        phone,
      },
    });
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
      <button
        type="button"
        onClick={handleVirtualTour}
        className="virtual-tour-button"
      >
        Schedule an Event Consultation Instead
      </button>
    </form>
  );
}

export default function Deposit() {
  const router = useRouter();
  const { name, email, phone, pricingOption, startTime, eventType } = router.query;

  return (
    <div className="page-container">
      <div className="card-container">
        <h1 className="heading">Lock Your Event Date</h1>
        <p className="paragraph">
          We have checked our calendar for your event date, start time, and duration to confirm that we currently have that window open.
          <br />
          To guarantee that your selected event date and time remain reserved exclusively for you until your tour, we require a deposit. We operate on a first-come, first-served basis, and a $10 deposit will hold your reservation from now until your tour with us, ensuring no one else can book it while you’re deciding. Once the deposit is received, we will reach out to schedule your tour. For longer holds, a 50% deposit will secure your reservation until 7 days before your event when the balance is due.
        </p>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            name={name}
            email={email}
            phone={phone}
            pricingOption={pricingOption}
            startTime={startTime}
            eventType={eventType}
          />
        </Elements>
      </div>
    </div>
  );
}
