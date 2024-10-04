import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './leadform.css'; // Importing the new CSS file
import moment from 'moment-timezone'; // Import moment-timezone for timezone handling
import UrgencyMeter from './urgencymeter.js'; // Adjust path as needed

export default function LeadForm() {
  const [formData, setFormData] = useState({
    eventDate: '',        // Date specified by the customer
    name: '',
    email: '',
    phone: '',
    pricingOption: '',
    eventTime: null,       // Time only (without date)
    startTime: null,       // Combined date/time object
    eventType: '',
    flexibility: '',
    venueSearchDuration: '', // New field: How long searching for a venue?
    secureVenueUrgency: '',  // New field: How soon looking to secure a venue?
  });

  const [showSecureVenueField, setShowSecureVenueField] = useState(false); // For conditional rendering

  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setFormData((prevData) => ({
        ...prevData,
        ...JSON.parse(storedData),
      }));
    } else {
      const { name, email, phone, eventDate } = router.query;
      setFormData((prevData) => ({
        ...prevData,
        name: name || '',
        email: email || '',
        phone: phone || '',
        eventDate: eventDate || '',
      }));
    }
  }, [router.query]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If venue search duration is changed, show the next question
    if (name === 'venueSearchDuration') {
      setShowSecureVenueField(true);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTimeChange = (time) => {
    setFormData((prevData) => {
      const combinedDateTime = moment.tz(`${prevData.eventDate} ${moment(time).format('HH:mm')}`, 'America/Chicago').toDate();
      return {
        ...prevData,
        eventTime: time,
        startTime: combinedDateTime,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!formData.venueSearchDuration || !formData.secureVenueUrgency) {
      alert('Please complete the form.');
      return;
    }

    // Convert eventTime to CST with AM/PM format
    const eventTimeCST = formData.eventTime
      ? moment.tz(formData.eventTime, 'America/Chicago').format('h:mm A')
      : null;

    const webhookUrl = '/api/qualifyproxy'; // Replace with your webhook URL

    try {
      const availability = await checkAvailability(formData.startTime, formData.pricingOption);
      const availabilityStatus = availability.isAvailable ? 'Available' : 'Not Available';

      // Submit form data to the webhook, including the new form fields
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          eventTime: formData.eventTime ? moment(formData.eventTime).format('HH:mm') : null, 
          eventTimeCST,
          startTime: formData.startTime ? formData.startTime.toISOString() : null, // Make sure startTime is not null
          availabilityStatus,
          venueSearchDuration: formData.venueSearchDuration,  // Include venue search duration
          secureVenueUrgency: formData.secureVenueUrgency,    // Include venue securing urgency
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit form data');
      }

      // Redirect based on availability, include all formData in the query parameters
      const nextPage = availability.isAvailable
        ? '/build-events'
        : formData.flexibility === 'Yes'
        ? '/virtualtour'
        : '/notavailable';

      router.push({
        pathname: nextPage,
        query: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          pricingOption: formData.pricingOption,
          startTime: formData.startTime ? formData.startTime.toISOString() : '', // Pass startTime only if available
          eventTime: eventTimeCST,
          eventDate: formData.eventDate,
          eventType: formData.eventType,
          flexibility: formData.flexibility,
          venueSearchDuration: formData.venueSearchDuration,  // Pass this to the next page
          secureVenueUrgency: formData.secureVenueUrgency,    // Pass this to the next page
        },
      });
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  const checkAvailability = async (startTime, pricingOption) => {
    if (!startTime || !pricingOption) {
      return { isAvailable: false };
    }

    let eventDuration = 0;
    switch (pricingOption) {
      case 'Standard Hourly':
        eventDuration = 4.5 * 60 * 60 * 1000; 
        break;
      case 'All Inclusive':
        eventDuration = 6.5 * 60 * 60 * 1000;
        break;
      case 'VIP Experience':
        eventDuration = 8.5 * 60 * 60 * 1000;
        break;
      default:
        throw new Error('Invalid pricing option selected');
    }

    const endDateTime = new Date(startTime.getTime() + eventDuration);

    try {
      const response = await fetch('/api/check-availability', {
        method: 'POST',
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          endTime: endDateTime.toISOString(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check availability');
      }

      const data = await response.json();
      return { isAvailable: data.isAvailable };
    } catch (error) {
      console.error('Error checking availability:', error);
      return { isAvailable: false };
    }
  };

  return (
    <section className="py-20 bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="container mx-auto max-w-lg bg-white p-10 rounded shadow-lg">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-yellow-600 uppercase">
            Great News, Your Date Has Some Availability <span className="text-red-600">But</span>
          </h2>
          <UrgencyMeter eventDate={formData.eventDate} />
        </div>

        <form className="mt-10" onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-4">
              Which Pricing Package Are You Interested In?
            </label>
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
                <span className="ml-2 text-gray-800 font-semibold">
                  STANDARD HOURLY, 50 GUESTS MAX, 4HR MINIMUM -{' '}
                </span>
                <span className="normal-font"> Starting at $625 flat ($125/hr + $125 cleaning fee)</span>
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
                <span className="ml-2 text-purple-600 font-semibold">
                  ALL INCLUSIVE, GAME ROOM, PHOTO LOUNGE, 60 GUESTS MAX, 6HR TOTAL -{' '}
                </span>
                <span className="normal-font"> Starting at $899 flat (no cleaning fee)</span>
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
                <span className="ml-2 text-yellow-600 font-semibold">
                  VIP EXPERIENCE, 60 GUESTS MAX, 10HR TOTAL -{' '}
                </span>
                <span className="normal-font"> Starting at $2999 flat (no cleaning fee)</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-2">Ideal Event Start Time</label>
            <DatePicker
              selected={formData.eventTime}
              onChange={handleTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholderText="Select a time"
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
            <label className="block text-lg text-gray-800 font-bold mb-2">
              I Am Flexible on My Event Date and Time
            </label>
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
                <span className="ml-2 normal-font">Yes, I am flexible</span>
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
                <span className="ml-2 normal-font">No, I am not flexible</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-4">
              How long have you been searching for a venue?
            </label>
            <select
              name="venueSearchDuration"
              value={formData.venueSearchDuration}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled>Select an option</option>
              <option value="Started today">Started today</option>
              <option value="1 week">1 week</option>
              <option value="It's been a while">It's been a while</option>
            </select>
          </div>

          {showSecureVenueField && (
            <div className="mb-8">
              <label className="block text-lg text-gray-800 font-bold mb-4">
                How soon are you looking to secure a venue?
              </label>
              <select
                name="secureVenueUrgency"
                value={formData.secureVenueUrgency}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="" disabled>Select an option</option>
                <option value="Right now">Right now</option>
                <option value="This week">This week</option>
                <option value="Not soon">Not soon</option>
              </select>
            </div>
          )}

          <input type="hidden" name="name" value={formData.name} />
          <input type="hidden" name="email" value={formData.email} />
          <input type="hidden" name="phone" value={formData.phone} />
          <input type="hidden" name="eventDate" value={formData.eventDate} />
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
