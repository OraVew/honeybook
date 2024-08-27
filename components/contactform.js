import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './contactform.css';
import { useRouter } from 'next/router';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    eventDate: null,
    name: '',
    email: '',
    phone: '',
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
    
    // 1. Send data to Zapier
    const webhookUrl = '/api/proxy';

try {
  await fetch(webhookUrl, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

      // 2. Redirect to the inquiry page
      router.push({
        pathname: '/inquiry', // Redirect to the inquiry page
        query: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventDate: formData.eventDate ? formData.eventDate.toISOString().split('T')[0] : null, // Send date as YYYY-MM-DD
        },
      });
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <section id="contactForm" className="py-20 bg-gray-100">
      <div className="container mx-auto max-w-lg bg-white p-8 rounded shadow-lg">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">Check Availability Now</h2>
          <p className="mt-4 text-lg text-gray-600">
            Do you want to check if we're available or visit us?
          </p>
        </div>
        <form className="mt-10" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="eventDate">
              When is your party?
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
          <button
            type="submit"
            className="w-full py-3 bg-[#D69600] text-white font-bold rounded hover:bg-#7B61FF transition duration-300 ease-in-out"
          >
            Check now
          </button>
        </form>
      </div>
    </section>
  );
}
