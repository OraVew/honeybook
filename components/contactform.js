import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './contactform.css';
import { useRouter } from 'next/router';
import clientPromise from '../../lib/mongodb'; // Import MongoDB client

// Helper function to save the inquiry to ChannelManager
async function saveInquiryToChannelManager(inquiryData) {
  try {
    const client = await clientPromise;
    const db = client.db("BookOraVew");
    const collection = db.collection("ChannelManager");

    await collection.insertOne(inquiryData);
    console.log("Inquiry saved successfully in ChannelManager.");
  } catch (error) {
    console.error("Error saving inquiry to ChannelManager:", error);
  }
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    eventDate: null,
    name: '',
    phone: '',
    email: '',
    guestCount: '',
    budget: '',
    bestTimeToContact: '',
    eventType: '',
  });

  const [isEmailFilled, setIsEmailFilled] = useState(false);
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

    // Show additional fields once the email field is filled
    if (name === 'email') {
      setIsEmailFilled(value.trim() !== '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inquiryDate = new Date();
    const apiUrl = '/api/save-inquiry';

    // Construct a guestMessage from form submission details
    const guestMessage = `
      Name: ${formData.name}, 
      Phone: ${formData.phone}, 
      Email: ${formData.email}, 
      Event Date: ${formData.eventDate ? formData.eventDate.toDateString() : 'Not specified'}, 
      Guest Count: ${formData.guestCount}, 
      Budget: $${formData.budget}, 
      Best Time to Contact: ${formData.bestTimeToContact}, 
      Event Type: ${formData.eventType}.
    `;

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
        const inquiryId = result.id;

        // Create inquiry object for ChannelManager
        const inquiryData = {
          inquiryId,
          customerName: formData.name,
          replyTo: formData.email,
          eventDateAndTime: formData.eventDate,
          attendeeCount: Number(formData.guestCount),
          payout: formData.budget,
          addOns: '', // Customize as needed
          platform: 'Direct Lead',
          threadId: `${formData.name}-${inquiryId}-DirectLead`,
          inquiryStatus: 'open',
          messages: [
            {
              timeSent: new Date(),
              guestMessage: guestMessage.trim(),
              sender: 'Customer',
              threadId: `${formData.name}-${inquiryId}-DirectLead`,
            },
          ],
          createdAt: new Date(),
          lastUpdatedAt: new Date(),
        };

        // Save to ChannelManager
        await saveInquiryToChannelManager(inquiryData);

        const zapierWebhookUrl = '/api/proxy';
        await fetch(zapierWebhookUrl, {
          method: 'POST',
          body: JSON.stringify({
            ...formData,
            inquiryId,
            inquiryDate: inquiryDate.toISOString(),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const encodedFormData = encodeURIComponent(
          JSON.stringify({
            ...formData,
            inquiryDate: inquiryDate.toISOString(),
            inquiryId,
          })
        );

        router.push({
          pathname: '/inquiry',
          query: { data: encodedFormData, inquiryId },
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
          <h2 className="text-4xl font-bold text-gray-800">Check if we're a match!</h2>
          <p className="mt-4 text-lg text-gray-600">
            Tell us some basic details for your event and we'll share our availability, answer your questions, provide an instant quote, and customize a plan for you.
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
          {isEmailFilled && (
            <>
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
                  type="number"
                  name="budget"
                  placeholder="E.g. $1000"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full p-2 border input-field rounded"
                  required
                  min="0"
                  step="1"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="bestTimeToContact">
                  Best time to contact you
                </label>
                <select
                  name="bestTimeToContact"
                  value={formData.bestTimeToContact}
                  onChange={handleChange}
                  className="w-full p-2 border input-field rounded"
                  required
                >
                  <option value="" disabled>Select a time</option>
                  <option value="Morning">Morning (8-11am)</option>
                  <option value="Afternoon">Afternoon (12-4pm)</option>
                  <option value="Evening">Evening (After 5pm)</option>
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
            </>
          )}
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

