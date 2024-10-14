import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import '../components/deposittour2.0.css'; // Use the existing CSS styles for deposit tour
import Gallery from '@/components/gallery';
import ReviewList from '@/components/reviewlist';
import FAQsComponent from '@/components/faqscomponent';
import FAQs from '@/components/faqs';
import Footer from '@/components/footer';
import Header from '@/components/header';

export default function BuildEventBrochure() {
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [showPriorityPass, setShowPriorityPass] = useState(false);
  const [showEventConsultation, setShowEventConsultation] = useState(false);
  const calendlyRef = useRef(null);
  const modalRef = useRef(null);


  useEffect(() => {
    const fetchData = async () => {
      const { id } = router.query;
      if (id) {
        try {
          const response = await fetch(`/api/get-inquiry?id=${id}`);
          const data = await response.json();
          if (data && data._id) {
            setFormData({ ...data, inquiryId: data._id });  // Store the ObjectId as inquiryId
          }
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
    if (showPriorityPass) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
      calendlyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showPriorityPass]);

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
    if (widgetType === 'priorityPass') {
      setShowPriorityPass(true);
    }
  };
  const handleModalClose = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowPriorityPass(false);
    }
  };

  const handleSubmit = async (offerName, offerDetails) => {
    const inquiryDate = new Date();
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/17285769/21h7vza/'; // Dynamic Offer Zapier URL

    // Include the selected offer as an object within the inquiry data
    const offerObject = {
      name: offerName,
      totalPrice: offerDetails.totalPrice,
      descriptionItems: offerDetails.descriptionItems,
    };

    try {
      const response = await fetch(`/api/update-inquiry?inquiryId=${formData.inquiryId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          inquiryDate: inquiryDate.toISOString(),
          selectedOffer: offerObject,  // Add the offer object to the inquiry data
          webhookUrl: zapierWebhookUrl, // Pass the webhook URL here
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update inquiry in MongoDB');
      }

      // Redirect to the event brochure page
      router.push(`/event-brochure?id=${formData.inquiryId}`);
    } catch (error) {
      console.error('Error submitting offer:', error);
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

  if (!formData) return <p style={{ color: 'white' }}>Loading...</p>;

  const selectedOffer = formData.selectedOffer || {};
  const { name: offerName, totalPrice, descriptionItems } = selectedOffer;

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
        <p className="text-center">
  At {new Date(formData.eventTime).toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: 'numeric', hour12: true })}
</p>
<br></br>

       
      


        {/* Offer Breakdown Section */}
        <div className="breakdown-container">
          <h3 className="text-xl text-center font-semibold text-black">{offerName}</h3>
          <ul className="list-disc list-inside text-center">
            {descriptionItems?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="breakdown-total text-center mt-4">
            <span className="font-bold">Total:</span> <span>${totalPrice?.toLocaleString()}</span>
          </div>
        </div>

        {/* Next Steps: Priority Pass or Event Consultation */}
        <div className="cards-container mt-10">
          <div className="card gold" onClick={() => handleCardClick('priorityPass')}>
            <h3 className="text-white">Reserve Now for $25</h3>
            <p>Lock the date now, and discuss the details later with our venue manager.</p>
          </div>
        </div>
        <div className="cards-container mt-10">
        <FAQsComponent formData={formData} // Pass formData as a prop 
  handleSubmit={handleSubmit} />
        </div>

         {/* About OraVew */}
         <section className="section">

         <div className="card-container">
          <h3 className="mt-6 text-2xl font-semibold text-center text-black">Welcome to OraVew's Venue</h3>

          {/* Shareable Link */}
        <section className="section button-container">
        <div className="mt-6 text-center">
          <h4 className="text-xl font-semibold">Share this event plan with your co-planners for their feedback or suggestions:</h4>
          <button
            onClick={handleShareViaText}
            className="share-btn"
          >
            Share Page via Text
          </button>
        </div>
        </section>

          <p className="text-center">Nestled in the heart of Chicago, OraVew is the perfect venue for intimate and memorable events.</p>
          <p className="text-center"><strong>Address</strong>: 1000 N Halsted St, Chicago, IL 60642</p>
        </div>

        {/* Floor Plans */}
        <div className="card-container">
          
          <div className="rounded bg-gray-200 p-4">
            <p className="event-info-text text-center">Every event comes with 30 chairs, 5 tables, 4 tall boys, 2 couches, an 8x4ft food table, and our sound system.</p>
            <div className="floor-plan">
            <Image
  src="/images/floorplan1.jpg"
  alt="Event Floor Plan"
  className="rounded shadow-lg consistent-image"
/>
            </div>
          </div>
        </div>
        </section>

        {/* Pricing Packages */}
        <section className="section">
        <div className="card-container">
        <h3 className="mt-6 text-2xl font-semibold text-center text-black">Pricing</h3>
<p className="text-center">Our rental fee is priced per hour. Four-hour minimum required.</p>

{/* Standard Pricing */}
<div className="mt-8">
  <h4 className="text-xl font-semibold text-black">Venue Rental</h4>
  <p className="text-center">Weekdays: $100/hour</p>
  <p className="text-center">Weekends: $125/hour</p>
  <p className="text-center">Late Night (10pm-2am): $165/hour</p>
</div>

{/* Add-ons Pricing */}
<div className="mt-8">
  <h4 className="text-xl font-semibold text-black">Optional Add-ons</h4>
  <p className="text-center">Game Room: $125 flat</p>
  <p className="text-center">Photo Booth Room: $125 flat</p>
  <p className="text-center">Birthday Numbers Marquee Lights: $100 flat</p>
</div>

{/* Special Packages */}
<div className="mt-8">
  <h4 className="text-xl font-semibold text-black">Special Packages</h4>
  <p className="text-center"><strong>Happy Birthday Package</strong></p>
  <ul className="list-disc list-inside text-center">
    <li className="text-center">6 hours, Game Room, Photo Lounge, and Marquee Lights</li>
    <li className="text-center">$1000 before 10pm or $1128 for hours after 10pm</li>
  </ul>
  <p className="text-center mt-4"><strong>Baby Shower Package</strong></p>
  <ul className="list-disc list-inside text-center">
    <li className="text-center">4 hours, Game Room, Photo Lounge, and Baby Block decor centerpieces</li>
    <li className="text-center">$700 before 6pm or $825 after 6pm</li>
  </ul>
</div>


          {/* Updated Images */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 image-grid">
          <Image
  src="/hero1.webp"
  alt="Standard Hourly Package"
  className="rounded shadow-lg consistent-image"
/>

          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 image-grid">
          <Image
  src="/bdayhero.webp"
  alt="All-Inclusive Package"
  className="rounded shadow-lg consistent-image"
/>
            <Image src="/babyhero2.webp" alt="VIP Package 2" layout="intrinsic" className="rounded shadow-lg consistent-image" />
            <Image src="/cocktailhero.webp" alt="VIP Package 1" layout="intrinsic" className="rounded shadow-lg consistent-image" />
          </div>
        </div>
        </section>

        {/* Amenities Section */}
        <section className="section">
        <div className="card-container">
          <h3 className="mt-6 text-2xl font-semibold text-center text-black">Amenities</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 image-grid">
            <Image src="/images/gameroom.jpg" alt="Game room" layout="intrinsic" className="rounded shadow-lg consistent-image" />
            <Image src="/images/photobooth.jpg" alt="Photo Booth" layout="intrinsic" className="rounded shadow-lg consistent-image" />
            <Image src="/images/marqueelights.jpg" alt="Marquee Lights" layout="intrinsic" className="rounded shadow-lg consistent-image" />
            <Image src="/images/photobooth360.png" alt="360" layout="intrinsic" className="rounded shadow-lg consistent-image" />
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
        <section className="section button-container">
        <h4 className="text-center">Let {formData.name} know you like this plan by pressing like and leave a comment!</h4>
        <div className="card-container mt-10">
          <button onClick={handleLike} className="like-btn">
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
              className="input"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="input"
            />
            <button type="submit" className="comment-btn">
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

        <section className="section">
        <FAQs />
        </section>

        <Footer/>

        {/* Calendly Widgets */}
        {/* Modal for Calendly */}
        {showPriorityPass && (
          <div className="modal" onClick={handleModalClose}>
            <div className="modal-content" ref={modalRef}>
              <span className="close" onClick={() => setShowPriorityPass(false)}>&times;</span>
              <div ref={calendlyRef} className="calendly-inline-widget" data-url={priorityPassUrl}></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
