import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../components/confirmation.css'; // Import the CSS file

export default function Confirmation() {
  const router = useRouter();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { inquiryId } = router.query; // Get inquiryId from URL query
      if (inquiryId) {
        try {
          const response = await fetch(`/api/get-inquiry?id=${inquiryId}`);
          const data = await response.json();
          if (data) {
            console.log('Fetched Data:', data); // Debugging: Log the data
            setFormData(data); // Set the retrieved form data
          } else {
            console.error('Data is undefined or null');
          }
        } catch (error) {
          console.error('Error fetching inquiry data:', error);
        }
      } else {
        console.error('inquiryId is not in the URL query');
      }
    };
    fetchData();
  }, [router.query]);

  if (!formData) return <p>Loading...</p>;

  const handleScheduleTour = () => {
    if (formData && formData._id) { // Check if _id exists
      router.push({
        pathname: '/deposittourpage',
        query: { inquiryId: formData._id }, // Use _id as inquiryId
      });
    } else {
      console.error('inquiryId is missing or undefined');
    }
  };
  

  return (
    <div className="confirmation-page-container">
      <div className="confirmation-card-container">
        <h1 className="confirmation-heading">Reservation Confirmed!</h1>
        <p className="confirmation-paragraph">
          Thank you, {formData.name}, for securing your event date and time with us. We have reserved the following event details:
        </p>
        <ul className="event-details-list">
          <li><strong>Event Type:</strong> {formData.eventType}</li>
          <li><strong>Event Date:</strong> {new Date(formData.startTime).toLocaleDateString()}</li>
          <li><strong>Start Time:</strong> {new Date(formData.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
        </ul>
        <p className="confirmation-paragraph">
          We operate on a first-come, first-served basis, and your $25 deposit has successfully held this reservation until your tour with us. We will reach out to you soon to schedule your tour.
        </p>
        <p className="confirmation-paragraph">
          If you have any questions or need to make changes, please don't hesitate to contact us at 309-271-2734.
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
