import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import './deposittour2.0.css';

export default function DepositTour() {
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const [showModal, setShowModal] = useState(false); // Show/Hide the modal
  const [calendlyUrl, setCalendlyUrl] = useState(''); // Store the Calendly URL
  const calendlyRef = useRef(null); // Reference for the Calendly widget container

  // Fetch form data using inquiryId from the query
  useEffect(() => {
    const fetchData = async () => {
      const { inquiryId } = router.query;
      if (inquiryId) {
        try {
          const response = await fetch(`/api/get-inquiry?id=${inquiryId}`);
          const data = await response.json();
          if (data) {
            setFormData(data);
            setEstimatedTotal(data.estimatedTotal || 0);
            setBreakdown(data.breakdown || {});
          }
        } catch (error) {
          console.error('Error fetching inquiry data:', error);
        }
      }
    };
    fetchData();
  }, [router.query]);

  // Load the Calendly widget script when the modal is open
  useEffect(() => {
    if (showModal) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      calendlyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showModal]);

  // Handle opening the modal with the correct Calendly URL
const handleCardClick = (widgetType) => {
  if (!formData) return;

  // Ensure the phone number starts with "1" for a US number
  let formattedPhone = formData.phone;
  if (formattedPhone && !formattedPhone.startsWith('1')) {
    formattedPhone = `1${formattedPhone}`;
  }

  // Set the appropriate Calendly URL based on the widget type
  if (widgetType === 'priorityPass') {
    setCalendlyUrl(
      `https://calendly.com/oravew/visit?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=d69600&name=${encodeURIComponent(
        formData.name
      )}&email=${encodeURIComponent(formData.email)}&a1=${encodeURIComponent(formattedPhone)}&guests=cscallender78@gmail.com`
    );
  } else if (widgetType === 'eventConsultation') {
    setCalendlyUrl(
      `https://calendly.com/oravew/schedule-a-call?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=d69600&name=${encodeURIComponent(
        formData.name
      )}&email=${encodeURIComponent(formData.email)}&a1=${encodeURIComponent(formattedPhone)}&guests=cscallender78@gmail.com`
    );
  }

  setShowModal(true); // Show the modal
};


  // Handle closing the modal
  const closeModal = () => {
    setShowModal(false);
    setCalendlyUrl(''); // Clear the Calendly URL
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <section className="section bg-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Options Section */}
        <div className="cards-container">
          <div className="card gold" onClick={() => handleCardClick('priorityPass')}>
            <h3>Schedule an in-person tour</h3>
            <p>Schedule your walkthrough to finalize details for your reservation.</p>
          </div>

          <div className="card purple" onClick={() => handleCardClick('eventConsultation')}>
            <h3>Schedule a virtual tour</h3>
            <p>Schedule a virtual consultation to discuss your reservation.</p>
          </div>
        </div>

        {/* Modal for Calendly Widget */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <div ref={calendlyRef} className="calendly-inline-widget" data-url={calendlyUrl}></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
