import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './leadform.css'; // Importing the new CSS file
import moment from 'moment-timezone'; // Import moment-timezone for timezone handling

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
    coPlanner: 'No',       // New field to track if user has co-planners
    coPlannerName: '',     // Separate field for co-planner's name
    coPlannerPhone: '',    // Separate field for co-planner's phone number
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTimeChange = (time) => {
    setFormData((prevData) => {
      // Combine the event date and selected time into a single Date object
      const combinedDateTime = moment.tz(`${prevData.eventDate} ${moment(time).format('HH:mm')}`, 'America/Chicago').toDate();
      
      return {
        ...prevData,
        eventTime: time,        // Store the time object separately
        startTime: combinedDateTime, // Combined date/time object
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert eventTime to CST with AM/PM format
    const eventTimeCST = formData.eventTime
      ? moment.tz(formData.eventTime, 'America/Chicago').format('h:mm A')
      : null;
  
    const webhookUrl = '/api/qualifyproxy'; // Replace with your webhook URL
  
    try {
      // Check availability based on the combined date/time object and pricing option
      const availability = await checkAvailability(formData.startTime, formData.pricingOption);
  
      const availabilityStatus = availability.isAvailable ? 'Available' : 'Not Available';
  
      // Submit form data to the webhook, including the separated co-planner fields
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          eventTime: formData.eventTime ? moment(formData.eventTime).format('HH:mm') : null, // Send time only to Zapier
          eventTimeCST, // Include the CST formatted event time with AM/PM
          startTime: formData.startTime.toISOString(), // Combined date/time object for availability check
          availabilityStatus, // Send "Available" or "Not Available" based on the check
          coPlannerName: formData.coPlannerName, // Include coPlanner name
          coPlannerPhone: formData.coPlannerPhone, // Include coPlanner phone number
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
          startTime: formData.startTime.toISOString(),
          eventDate: formData.eventDate,
          eventType: formData.eventType,
          coPlanner: formData.coPlanner,
          coPlannerName: formData.coPlannerName, // Include coPlanner name in query
          coPlannerPhone: formData.coPlannerPhone, // Include coPlanner phone in query
        },
      });
    } catch (error) {
      console.error('Error submitting form data:', error);
      // Optionally, display an error message to the user
    }
  };

  /**
   * Function to check availability based on the combined date/time object and pricing option.
   *
   * @param {Date} startTime - The combined date/time object.
   * @param {string} pricingOption - The selected pricing option.
   * @returns {Promise<{ isAvailable: boolean }>} - Availability status.
   */
  const checkAvailability = async (startTime, pricingOption) => {
    // Determine the event duration based on the pricing option
    let eventDuration = 0;
    switch (pricingOption) {
      case 'Standard Hourly':
        eventDuration = 4.5 * 60 * 60 * 1000; // 4 hours + 30 minutes in milliseconds
        break;
      case 'All Inclusive':
        eventDuration = 6.5 * 60 * 60 * 1000; // 6 hours + 30 minutes in milliseconds
        break;
      case 'VIP Experience':
        eventDuration = 8.5 * 60 * 60 * 1000; // 8 hours + 30 minutes in milliseconds
        break;
      default:
        throw new Error('Invalid pricing option selected');
    }

    const endDateTime = new Date(startTime.getTime() + eventDuration);

    // Example implementation:
    // Make a request to your backend API that checks Google Calendar
    // Replace '/api/check-availability' with your actual API endpoint
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
      // Default to not available in case of an error
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
          <p className="mt-4 text-lg text-gray-800">
            We have other active inquiries for the date you're looking to book.
          </p>
          <p className="mt-4 text-lg text-red-600 font-bold">
            You can speed up your inquiry by answering a few additional questions so our team can assist you faster!
          </p>
        </div>
        <form className="mt-10" onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-4">
              Which Pricing Option Are You Interested In?
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
          {/* New Question for Co-Planners */}
          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-2">
              Do you have any co-planners or advisors for your event? (Decorator, family, etc)
            </label>
            <div className="space-y-3">
              <label className="block">
                <input
                  type="radio"
                  name="coPlanner"
                  value="Yes"
                  checked={formData.coPlanner === 'Yes'}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2 normal-font">Yes</span>
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="coPlanner"
                  value="No"
                  checked={formData.coPlanner === 'No'}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2 normal-font">No</span>
              </label>
            </div>
          </div>
          {/* Optional Co-Planner Name and Phone Fields */}
          {formData.coPlanner === 'Yes' && (
            <>
              <div className="mb-8">
                <label className="block text-lg text-gray-800 font-bold mb-2">
                  Co-Planner's Name (Optional)
                </label>
                <input
                  type="text"
                  name="coPlannerName"
                  value={formData.coPlannerName}
                  onChange={handleChange}
                  placeholder="Ex: John Doe"
                  className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-8">
                <label className="block text-lg text-gray-800 font-bold mb-2">
                  Co-Planner's Phone Number (Optional)
                </label>
                <input
                  type="text"
                  name="coPlannerPhone"
                  value={formData.coPlannerPhone}
                  onChange={handleChange}
                  placeholder="Ex: (123) 456-7890"
                  className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </>
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
