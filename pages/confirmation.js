import { useRouter } from 'next/router';
import '../components/confirmation.css'; // Import the CSS file

export default function Confirmation() {
  const router = useRouter();
  const { name, email, phone, pricingOption, startTime, eventType } = router.query;

  const handleScheduleTour = () => {
    router.push({
      pathname: '/deposittourpage',
      query: {
        name,
        email,
        phone,
      },
    });
  };

  return (
    <div className="confirmation-page-container">
      <div className="confirmation-card-container">
        <h1 className="confirmation-heading">Reservation Confirmed!</h1>
        <p className="confirmation-paragraph">
          Thank you, {name}, for securing your event date and time with us. We have reserved the following event details:
        </p>
        <ul className="event-details-list">
          <li><strong>Event Type:</strong> {eventType}</li>
          <li><strong>Event Date:</strong> {new Date(startTime).toLocaleDateString()}</li>
          <li><strong>Start Time:</strong> {new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
          <li><strong>Pricing Option:</strong> {pricingOption}</li>
        </ul>
        <p className="confirmation-paragraph">
          We operate on a first-come, first-served basis, and your $10 deposit has successfully held this reservation until your tour with us. No one else can book this slot while you’re deciding. We will reach out to you soon to schedule your tour. For longer holds, a 50% deposit will secure your reservation until 7 days before your event when the balance is due.
        </p>
        <p className="confirmation-paragraph">
          If you have any questions or need to make changes, please don't hesitate to contact us.
        </p>
        <button
          className="confirmation-button"
          onClick={handleScheduleTour}
        >
          Schedule Your Tour Now
        </button>
      </div>
    </div>
  );
}
