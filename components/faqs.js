"use client";
import React from 'react';
import '../app/globals.css';
import styles from '../components/faqs.module.css'; // Make sure to add your specific CSS module

export default function FAQs() {
  const faqs = [
    {
      heading: "Where are you located?",
      body: "1000 N Halsted St. Chicago, IL. 60642. On Goose Island near West Loop. Between Division and Chicago streets.",
    },
    {
      heading: "Can I bring alcohol, food, or catering?",
      body: "Guests are allowed to bring their own alcohol. Outside food is allowed, but no cooking is allowed on site. The kitchenette is equipped with a microwave, mini fridge, and water dispenser.",
    },
    {
      heading: "What is the guest limit?",
      body: "Our 2000 sq. ft. venue is ideal for intimate gatherings and larger events of up to 60 guests.",
    },
    {
      heading: "Can I play loud music or bring a DJ?",
      body: "DJ and amplified music are allowed. The venue provides speakers, Television, Microphones, and a Projector.",
    },
    {
      heading: "Where do we park?",
      body: "Parking for 50+ cars is available. 20 in the back for free. And 30+ metered parking in front.",
    },
    {
      heading: "How do I get inside?",
      body: "Easy entry with our keyless access system. Instructions will be sent upon visits or bookings.",
    },
    {
      heading: "Will furniture be provided or can I bring my own?",
      body: "45 dinner chairs, 8 rectangle tables, and 4 tall boys. Feel free to bring additional furniture.",
    },
    {
      heading: "Does The Celebration Loft have a time minimum?",
      body: "Our events require a 4-hour time minimum.",
    },
    {
      heading: "How much time do you allow for set-up and tear-down?",
      body: "Yes, we offer 30 minutes for set-up before an event + 30 minutes for tear-down after the event.",
    },
    {
      heading: "What is the pricing to reserve The Celebration Loft?",
      body: "Our rental fee is priced per hour. Weekdays (Monday through Thursday) are $100/hour. Weekends (Friday through Sunday) are $125/hour before 10 p.m. and $165/hour after 10 p.m.",
    },
    {
      heading: "Do you charge extra fees?",
      body: "We believe in being fair and transparent about fees. We charge a $150 cleaning fee. We do NOT charge service or gratuity fees.",
    },
    {
      heading: "Is it possible to tour the space?",
      body: "Yes, please contact us to arrange an appointment. We’d love to show you around the venue, answer your questions, and learn more about your event.",
    },
    {
      heading: "How do I book an event?",
      body: "Please submit an inquiry online. Our responsive team will share information on our amenities, availability, and pricing, and answer any questions. We will also invite you to tour the space by appointment. Once you’re ready, it’s as simple as booking the event from your phone!",
    },
    {
      heading: "Am I allowed to bring in outside alcohol?",
      body: "Yes! The Celebration Loft is one of the few venues in the city that allows outside alcohol.",
    },
    {
      heading: "Can I bring in my own caterer, vendors, and decor?",
      body: "Of course! You’re welcome to bring in your own caterer, vendors, and decor. That’s a unique aspect that sets The Celebration Loft apart. It’s an event venue where you can truly transform the space and showcase your style.",
    },
    {
      heading: "Can you help me plan and execute my event?",
      body: "Yes! We offer a preferred vendor list and an à la carte list of add-on options, such as a champagne wall, mimosa bar, tablescapes, rentals, and more. We’re happy to coordinate directly with vendors as needed, and we provide an experienced team on the day of your event to ensure everything runs smoothly.",
    },
    {
      heading: "Do you host corporate events?",
      body: "Absolutely! We’ve received feedback that corporate teams are more engaged and interactive when meeting at The Celebration Loft, compared to a more generic or public space.",
    },
    {
      heading: "Is there parking available?",
      body: "Yes, there is a free parking lot directly behind our building — just steps away!",
    },
    {
      heading: "Are tables and chairs provided?",
      body: "Yes, we can create a custom floor plan for your event.",
    },
    {
      heading: "Is The Celebration Loft wheelchair accessible?",
      body: "Yes, there is an elevator at the main entrance and bathrooms are accessible.",
    },
    {
      heading: "Is there Wi-Fi available?",
      body: "Yes, free Wi-Fi is available and the space is equipped with bluetooth system speakers.",
    },
  ];

  return (
    <section className={`${styles.section} py-12 bg-gray-100`}>
      <div className={styles.container}>
        <h2 className={`${styles.heading} text-center text-3xl font-bold mb-8`}>QUESTIONS? WE'VE GOT ANSWERS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-300 py-4">
              <h3 className={`${styles.question} text-xl font-semibold`}>{faq.heading}</h3>
              <p className={`${styles.answer} mt-2 text-gray-600`}>{faq.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
