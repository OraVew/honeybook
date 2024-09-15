import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import './virtualtourform.css';  // Import the new CSS file

export default function DepositTour() {
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

  const calendlyUrl = `https://calendly.com/oravew/virtual-tour-with-a-member-of-our-team-clone?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=d69600&name=${encodeURIComponent(userData.name)}&email=${encodeURIComponent(userData.email)}&a1=${encodeURIComponent(userData.phone)}`;

  // ...rest of the code remains the same

return (
  <section className="section">
    <div className="container">
      <h2>Reserve Your Event Date with Confidence</h2>
      <p>
        We understand how important it is to secure your perfect event date. Introducing our <strong style={{ color: '#D69600' }}>Refundable Priority Pass</strong> – reserve your desired date and time <em>exclusively for you</em> for 7 days while you finalize your plans, <strong>risk-free</strong>.
      </p>
      <p>
        The pass is fully refundable if you decide not to proceed, and if you choose to move forward, the fee is <strong>applied toward your booking</strong>. It's a win-win!
      </p>
      <p className="highlight">
        We've pre-filled your information for your convenience. Simply select a date and a 15-minute time slot to get started.
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
