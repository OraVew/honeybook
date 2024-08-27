import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import './leadform.css'; // Importing the new CSS file

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pricingOption: '',
    startTime: '',
    eventType: '',
    flexibility: '',
  });

  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setFormData((prevData) => ({
        ...prevData,
        ...JSON.parse(storedData),
      }));
    } else {
      const { name, email, phone } = router.query;
      setFormData((prevData) => ({
        ...prevData,
        name: name || '',
        email: email || '',
        phone: phone || '',
      }));
    }
  }, [router.query]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const webhookUrl = '/api/qualifyproxy';

try {
  await fetch(webhookUrl, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

      router.push({
        pathname: '/virtualtour',
        query: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      });

    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <section className="py-20 bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="container mx-auto max-w-lg bg-white p-10 rounded shadow-lg">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-yellow-600 uppercase">
            Great News, Our Space is Available <span className="text-red-600">But</span>
          </h2>
          <p className="mt-4 text-lg text-gray-800">
            We have other active inquiries for the date you're looking to book.
          </p>
          <p className="mt-4 text-lg text-purple-600 font-bold">
            You can speed up your inquiry by answering a few additional questions so our team can assist you faster!
          </p>
        </div>
        <form className="mt-10" onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-4">Which Pricing Options Are You Interested In?</label>
            <div className="space-y-3">
              <label className="block">
                <input
                  type="radio"
                  name="pricingOption"
                  value="Standard Hourly"
                  checked={formData.pricingOption === 'Standard Hourly'}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2 text-gray-800 font-semibold">STANDARD HOURLY, 4HR MINIMUM - </span><span className="normal-font"> $125/hr + $125 cleaning fee</span>
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="pricingOption"
                  value="All Inclusive"
                  checked={formData.pricingOption === 'All Inclusive'}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2 text-purple-600 font-semibold">ALL INCLUSIVE + GAME ROOM, 6HR TOTAL - </span><span className="normal-font"> Starting at $999, no cleaning fee</span>
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="pricingOption"
                  value="VIP Experience"
                  checked={formData.pricingOption === 'VIP Experience'}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2 text-yellow-600 font-semibold">VIP EXPERIENCE, 8HR TOTAL - </span><span className="normal-font"> Starting at $2999, no cleaning fee</span>
              </label>
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-2">Ideal Event Start Time</label>
            <input
              type="text"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              placeholder="Ex: 6pm"
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-2">What Is Your Event?</label>
            <input
              type="text"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              placeholder="Ex: Birthday, Babyshower..."
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-2">I Am Flexible on My Event Date and Time</label>
            <div className="space-y-3">
            <label className="block">
  <input
    type="radio"
    name="flexibility"
    value="Yes"
    checked={formData.flexibility === 'Yes'}
    onChange={handleChange}
    required
  />
  <span className="normal-font">Yes, I am flexible</span>
</label>
<label className="block">
  <input
    type="radio"
    name="flexibility"
    value="No"
    checked={formData.flexibility === 'No'}
    onChange={handleChange}
    required
  />
  <span className="normal-font">No, I am not flexible</span>
</label>

            </div>
          </div>
          <input type="hidden" name="name" value={formData.name} />
          <input type="hidden" name="email" value={formData.email} />
          <input type="hidden" name="phone" value={formData.phone} />
          <button
            type="submit"
            className="w-full py-4 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 transition duration-300 ease-in-out"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </section>
  );
}
