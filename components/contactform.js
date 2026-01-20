import './contactform.css';

export default function ContactForm() {
  return (
    <section id="contactForm" className="py-20 bg-gray-100">
      <div className="container mx-auto max-w-lg bg-white p-8 rounded shadow-lg">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">Temporarily Closed</h2>
          <p className="mt-6 text-lg text-gray-600">
            We are currently not accepting new bookings at this time.
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for your interest and we apologize for any inconvenience.
          </p>
        </div>
      </div>
    </section>
  );
}
