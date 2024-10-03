import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import '../components/deposittour.css'; // Use the existing CSS styles for deposit tour
import Gallery from '@/components/gallery';
import ReviewList from '@/components/reviewlist';

export default function BuildEventBrochure() {
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState(''); // New state for name input
  const [showPriorityPass, setShowPriorityPass] = useState(false);
  const [showEventConsultation, setShowEventConsultation] = useState(false);
  const calendlyRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const { id } = router.query;
      if (id) {
        try {
          const response = await fetch(`/api/get-inquiry?id=${id}`);
          const data = await response.json();
          setFormData(data);
          setLikes(data.likes || 0);
          setComments(data.comments || []);
        } catch (error) {
          console.error('Error fetching inquiry data:', error);
        }
      }
    };
    fetchData();
  }, [router.query]);

  useEffect(() => {
    if (showPriorityPass || showEventConsultation) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
      calendlyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showPriorityPass, showEventConsultation]);

  const handleLike = async () => {
    setLikes(likes + 1);
    try {
        await fetch('/api/update-inquiry-likes', {
            method: 'POST',
            body: JSON.stringify({ id: router.query.id, likes: likes + 1 }),
            headers: { 'Content-Type': 'application/json' },
          });
          
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const updatedComments = [...comments, `${newName}: ${newComment}`];
    setComments(updatedComments);
    setNewComment('');
    setNewName('');

    try {
        await fetch('/api/update-inquiry-comments', {
            method: 'POST',
            body: JSON.stringify({ id: router.query.id, comment: `${newName}: ${newComment}` }),
            headers: { 'Content-Type': 'application/json' },
          });
          
    } catch (error) {
      console.error('Error updating comments:', error);
    }
  };

  const handleCardClick = (widgetType) => {
    setShowPriorityPass(false);
    setShowEventConsultation(false);

    if (widgetType === 'priorityPass') {
      setShowPriorityPass(true);
    } else if (widgetType === 'eventConsultation') {
      setShowEventConsultation(true);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!formData) return <p>Loading...</p>;
  const breakdown = formData.estimatedBreakdown || {};

  const shareableLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/event-brochure?id=${router.query.id}`;

  const priorityPassUrl = `https://calendly.com/oravew/virtual-tour-with-a-member-of-our-team-clone?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=d69600&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&a1=${encodeURIComponent(formData.phone)}`;
  const eventConsultationUrl = `https://calendly.com/oravew/event-consultation?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=d69600&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&a1=${encodeURIComponent(formData.phone)}`;

  const handleShareViaText = () => {
    const message = `Check out my event plans here and let me know what you think! ${shareableLink}`;
    window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
  };

  return (
    <section className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        {/* Event Breakdown Section */}
        <h2 className="text-3xl font-bold mb-4 text-center">{formData.name}'s {formData.eventType}</h2>
        <p className="text-center">{formatDate(formData.eventDate)}</p>
        <p className="text-center">At {formData.eventTime}</p>
        <p className="text-center">{formData.pricingOption} Package</p>

        {/* Estimated Total */}
        <div className="breakdown-container">
          <h3 className="text-xl text-center font-semibold">Estimated Venue Total</h3>
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
            <span>${formData.estimatedTotal?.toLocaleString()}</span>
          </div>
        </div>

        {/* Next Steps: Priority Pass or Event Consultation */}
        <div className="cards-container mt-10">
          <div className="card gold" onClick={() => handleCardClick('priorityPass')}>
            <h3>Reserve Now for $25</h3>
            <p>Lock the date now, and discuss the details later with our venue manager.</p>
          </div>
          <div className="card purple" onClick={() => handleCardClick('eventConsultation')}>
            <h3>Speak with Event Planner Instead</h3>
            <p>Schedule a virtual consultation with our event planner.</p>
          </div>
        </div>

        

         {/* About OraVew */}
         <section className="section">

         <div className="card-container">
          <h3 className="mt-6 text-2xl font-semibold text-center">Welcome to OraVew's Venue</h3>
          {/* Shareable Link */}
        <section className="section">
        <div className="mt-6 text-center">
          <h4 className="text-xl font-semibold">Share this event plan with your co-planners for their feedback or suggestions:</h4>
          <button
            onClick={handleShareViaText}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Share via Text
          </button>
        </div>
        </section>

          <p className="text-center">Nestled in the heart of Chicago, OraVew is the perfect venue for intimate and memorable events.</p>
          <p className="text-center"><strong>Address</strong>: 1000 N Halsted St, Chicago, IL 60642</p>
          {/* <p className="text-center">Find us on Google Maps <a href="https://www.google.com/search?q=oravew" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">here</a>.</p> */}
        </div>

        {/* Floor Plans */}
        <div className="card-container">
          <h3 className="mt-6 text-2xl font-semibold text-center">Our Floor Plan</h3>
          <div className="rounded bg-gray-200 p-4">
            <p className="event-info-text text-center">Every event comes with 30 chairs, 5 tables, 4 tall boys, 2 couches, an 8x4ft food table, and our sound system.</p>
            <div className="floor-plan">
        <Image
          src="/images/floorplan1.jpg" // Replace with your actual image path
          alt="Event Floor Plan"
          width={800}  // Set appropriate width for larger screens
          height={500} // Set appropriate height for larger screens
          className="rounded shadow-lg w-full md:w-2/3" // Make it responsive for mobile
        />
      </div>
          </div>
        </div>
        </section>

        {/* Pricing Packages */}
        <section className="section">

        <div className="card-container">
          <h3 className="mt-6 text-2xl font-semibold text-center">Pricing Packages</h3>
          <p className="text-center">We understand that every event has different needs. Our pricing packages are flexible to accommodate both small, intimate gatherings and larger celebrations:</p>
          <ul>
            <li className="text-center"><strong>Standard Hourly Package</strong>: $125/hour with a 4-hour minimum + $125 cleaning fee. 50 Guests.</li>
            <li className="text-center"><strong>All-Inclusive Package</strong>: $899 flat for 6 hours, including access to the game room and photo lounge. 60 Guests.</li>
            <li className="text-center"><strong>VIP Package</strong>: $2,999 for a full 12-hour day, with full suite access. 50 Chivari Chairs, Linen covered tables, Color/Theme Decor, Table Centerpieces, Balloon/Floral, Photographer, 360 Photo Booth, Marquee Lights, and more!</li>
          </ul>

          {/* Updated Images */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image src="/hero1.webp" alt="Standard Hourly Package" layout="intrinsic" width={400} height={400} className="rounded shadow-lg" />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image src="/bdayhero.webp" alt="All-Inclusive Package" layout="intrinsic" width={400} height={400} className="rounded shadow-lg" />
            <Image src="/babyhero2.webp" alt="VIP Package 2" layout="intrinsic" width={400} height={400} className="rounded shadow-lg" />
            <Image src="/cocktailhero.webp" alt="VIP Package 1" layout="intrinsic" width={400} height={400} className="rounded shadow-lg" />
          </div>
        </div>
        </section>

        {/* Amenities Section */}
        <section className="section">

        <div className="card-container">
          <h3 className="mt-6 text-2xl font-semibold text-center">Amenities</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image src="/images/gameroom.jpg" alt="Game room" layout="intrinsic" width={300} height={300} className="rounded shadow-lg" />
            <Image src="/images/photobooth.jpg" alt="Photo Booth" layout="intrinsic" width={300} height={300} className="rounded shadow-lg" />
            <Image src="/images/marqueelights.jpg" alt="Marquee Lights" layout="intrinsic" width={300} height={300} className="rounded shadow-lg" />
            <Image src="/images/photobooth360.png" alt="360" layout="intrinsic" width={300} height={300} className="rounded shadow-lg" />
          </div>
          <ul className="list-none text-center">
            <li><strong>Free Parking</strong>: 30+ parking spots for guests.</li>
            <li>Flexible BYOB & Catering Policies.</li>
            <li>Stylish Furnishing and Bluetooth Sound System Included.</li>
            <li>Add-on Game Room, Photo-lounge Room, Marquee Lights, 360 Photo Booth, Furniture, and more!.</li>
          </ul>
        </div>
        </section>

        {/* Interactive Section (Likes and Comments) */}
        <section className="section">

        <h4 className="text-center">Let {formData.name} know you like this plan by pressing like and leave a comment!</h4>
        <div className="card-container mt-10">
          <button onClick={handleLike} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Like ({likes})
          </button>

          <h4 className="text-center">Comments</h4>
          <ul className="list-none">
            {comments.map((comment, index) => (
              <li key={index} className="border-b py-2">{comment}</li>
            ))}
          </ul>


          <form onSubmit={handleCommentSubmit} className="mt-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Your name"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border rounded mt-2"
            />
            <button type="submit" className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
              Submit Comment
            </button>
          </form>
        </div>
        </section>

        {/* Recent Event Images */}
        <section className="section">

        <Gallery />
        </section>

        <section className="section">
        <ReviewList />
        </section>

        {/* Calendly Widgets */}
        <div ref={calendlyRef}>
          {showPriorityPass && <div className="calendly-inline-widget" data-url={priorityPassUrl}></div>}
          {showEventConsultation && <div className="calendly-inline-widget" data-url={eventConsultationUrl}></div>}
        </div>
      </div>
    </section>
  );
}
