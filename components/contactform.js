import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './contactform.css';
import { useRouter } from 'next/router';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    eventDate: null,
    name: '',
    phone: '',
    email: '',
    guestCount: '',
    budget: '',
    howDidYouFindUs: '',
    eventType: '',
  });

  const router = useRouter();

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      eventDate: date,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Capture the current date and time for "Inquiry Date"
    const inquiryDate = new Date();

    // 2. Send data to the API which will forward it to MongoDB and return an inquiryId
    const apiUrl = '/api/save-inquiry';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          inquiryDate: inquiryDate.toISOString(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.id) {
        // 3. Retrieve the inquiryId from the response
        const inquiryId = result.id;

        // 4. Send data to Zapier (including the inquiryId)
        const zapierWebhookUrl = '/api/qualifyproxy'; // Replace with your actual Zapier webhook URL
        await fetch(zapierWebhookUrl, {
          method: 'POST',
          body: JSON.stringify({
            ...formData,
            inquiryId, // Include the inquiryId in the Zapier webhook
            inquiryDate: inquiryDate.toISOString(),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 5. Redirect to the next page (inquiry page) with the encoded data and inquiryId
        const encodedFormData = encodeURIComponent(JSON.stringify({
          ...formData,
          inquiryDate: inquiryDate.toISOString(),
          inquiryId, // Include inquiryId in the route
        }));

        router.push({
          pathname: '/inquiry',
          query: { data: encodedFormData, inquiryId }, // Send inquiryId and encoded form data as query params
        });
      } else {
        throw new Error('Failed to save inquiry');
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <section id="contactForm" className="py-20 bg-gray-100">
      <div className="container mx-auto max-w-lg bg-white p-8 rounded shadow-lg">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">Let&apos;s Start With Basics</h2>
          <p className="mt-4 text-lg text-gray-600">
            Tell us some basic details of your event and we'll tell you our availability, answer your questions, provide an instant quote, and customize a plan for you.
          </p>
        </div>
        <form className="mt-10" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="eventDate">
              Ideal Event Date
            </label>
            <DatePicker
              selected={formData.eventDate}
              onChange={handleDateChange}
              className="w-full p-2 border input-field rounded"
              placeholderText="Select a date"
              dateFormat="MM/dd/yyyy"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Your full name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name here"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border input-field rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="E.g. 541 444 0755"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border input-field rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Your email
            </label>
            <input
              type="email"
              name="email"
              placeholder="E.g. myemail@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border input-field rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="guestCount">
              Estimated Guest Count
            </label>
            <input
              type="number"
              name="guestCount"
              placeholder="E.g. 50"
              value={formData.guestCount}
              onChange={handleChange}
              className="w-full p-2 border input-field rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="budget">
              Budget
            </label>
            <input
              type="text"
              name="budget"
              placeholder="E.g. $1000"
              value={formData.budget}
              onChange={handleChange}
              className="w-full p-2 border input-field rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="howDidYouFindUs">
              How did you find us?
            </label>
            <select
              name="howDidYouFindUs"
              value={formData.howDidYouFindUs}
              onChange={handleChange}
              className="w-full p-2 border input-field rounded"
              required
            >
              <option value="" disabled>Select an option</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Google">Google</option>
              <option value="Peerspace/TagVenue/Splacer">Peerspace/TagVenue/Splacer</option>
              <option value="Referral">Referral</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="eventType">
              Tell me more about this event
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full p-2 border input-field rounded"
              required
            >
              <option value="" disabled>Select an event type</option>
              <option value="Birthday">Birthday</option>
              <option value="Baby Shower">Baby Shower</option>
              <option value="Engagement">Engagement</option>
              <option value="Wedding">Wedding</option>
              <option value="Memorial">Memorial</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#D69600] text-white font-bold rounded hover:bg-[#7B61FF] transition duration-300 ease-in-out"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
