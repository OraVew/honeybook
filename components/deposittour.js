import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import './deposittour.css'; // Import the new CSS file

export default function DepositTour() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const [showPriorityPass, setShowPriorityPass] = useState(false); // Show/Hide Priority Pass Calendly widget
  const [showEventConsultation, setShowEventConsultation] = useState(false); // Show/Hide Event Consultation Calendly widget

  // Create a reference for the Calendly widget container
  const calendlyRef = useRef(null);

  useEffect(() => {
    const { name, email, phone, estimatedTotal, estimatedBreakdown } = router.query;

    setUserData({
      name: name || '',
      email: email || '',
      phone: phone || '',
    });

    setEstimatedTotal(Number(estimatedTotal) || 0);
    setBreakdown(JSON.parse(estimatedBreakdown) || {});
  }, [router.query]);

  useEffect(() => {
    if (showPriorityPass || showEventConsultation) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      // Scroll to the Calendly widget container when the widget is shown
      calendlyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showPriorityPass, showEventConsultation]);

  const handleCardClick = (widgetType) => {
    // Reset visibility of both widgets
    setShowPriorityPass(false);
    setShowEventConsultation(false);

    // Show the appropriate widget based on the card clicked
    if (widgetType === 'priorityPass') {
      setShowPriorityPass(true);
    } else if (widgetType === 'eventConsultation') {
      setShowEventConsultation(true);
    }
  };

  const priorityPassUrl = `https://calendly.com/oravew/virtual-tour-with-a-member-of-our-team-clone?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=d69600&name=${encodeURIComponent(
    userData.name
  )}&email=${encodeURIComponent(userData.email)}&a1=${encodeURIComponent(userData.phone)}`;

  const eventConsultationUrl = `https://calendly.com/oravew/event-consultation?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=d69600&name=${encodeURIComponent(
    userData.name
  )}&email=${encodeURIComponent(userData.email)}&a1=${encodeURIComponent(userData.phone)}`;

  return (
    <section className="section bg-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Estimated Total and Breakdown */}
        <div className="breakdown-container">
          <h3>Estimated Venue Total</h3>
          <ul>
            {Object.entries(breakdown).map(([key, value]) => (
              <li key={key}>
                <span>{key}</span>
                <span>{value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="breakdown-total">
            <span>Total</span>
            <span>${estimatedTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Options Section */}
        <div className="cards-container">
          {/* Priority Pass Appointment */}
          <div
            className="card gold"
            onClick={() => handleCardClick('priorityPass')}
          >
            <h3>Schedule a Reservation Call</h3>
            <p>
              Schedule a virtual tour with our venue manager to finalize details for your reservation.
            </p>
          </div>

          {/* Event Consultation */}
          <div
            className="card purple"
            onClick={() => handleCardClick('eventConsultation')}
          >
            <h3>Speak with Event Planner Instead</h3>
            <p>
              Schedule a virtual consultation and walk-through with our event planner to discuss your event details.
            </p>
          </div>
        </div>

        {/* Calendly Inline Widgets */}
        <div ref={calendlyRef}>
          {showPriorityPass && (
            <div className="calendly-inline-widget" data-url={priorityPassUrl}></div>
          )}
          {showEventConsultation && (
            <div className="calendly-inline-widget" data-url={eventConsultationUrl}></div>
          )}
        </div>
      </div>
    </section>
  );
}
