import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import './virtualtourform.css';  // Import the new CSS file

export default function VirtualTourForm() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const { name, email, phone } = router.query;
    setUserData({
      name: name || '',
      email: email || '',
      phone: phone || '',
    });

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router.query]);

  const calendlyUrl = `https://calendly.com/oravew/event-consultation?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=d69600&name=${encodeURIComponent(userData.name)}&email=${encodeURIComponent(userData.email)}&a1=${encodeURIComponent(userData.phone)}`;

  return (
    <section className="section">
      <div className="container">
        <h2>Event Consultation</h2>
        <p>Schedule a virtual consultation and walk-through with our event planner below so you can see our space, learn more about us, and plan your event from any location at any time.</p>
        <p className="highlight">
          We've already filled in all your info for you, you just need to select a date and a 15-minute time slot.
        </p>
        <div
          className="calendly-inline-widget"
          data-url={calendlyUrl}
          style={{ minWidth: '320px', height: '700px' }}
        ></div>
      </div>
    </section>
  );
}
