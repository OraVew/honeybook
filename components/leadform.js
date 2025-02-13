import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './leadform.css'; // Importing the new CSS file
import moment from 'moment-timezone'; // Import moment-timezone for timezone handling
import UrgencyMeter from './urgencymeter.js'; // Adjust path as needed

export default function LeadForm() {
  const [formData, setFormData] = useState({
    eventDate: '',        
    name: '',
    email: '',
    phone: '',
    eventTime: null,       
    startTime: null,       
    eventDuration: '',     
    venueSearchDuration: '', 
    secureVenueUrgency: '',  
    helpNeeded: '',        
    inquiryId: '',         
    guestCount: 0,
    budget: 0,
    howDidYouFindUs: '',
    eventType: '',
    inquiryDate: '',   
    hoursNeeded: 0,
    lookingFrom: '',
    planningToBook: '',
    customerProfile: '',  
    isAvailable: ''
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  useEffect(() => {
    if (router.query.data) {
      const decodedData = JSON.parse(decodeURIComponent(router.query.data));
      setFormData((prevData) => ({
        ...prevData,
        ...decodedData,
      }));
    }

    if (router.query.inquiryId) {
      setFormData((prevData) => ({
        ...prevData,
        inquiryId: router.query.inquiryId,
      }));
    }
  }, [router.query.data, router.query.inquiryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTimeChange = (time) => {
    if (formData.eventDate && time) {
      const combinedDateTime = moment.tz(
        `${moment(formData.eventDate).format('YYYY-MM-DD')} ${moment(time).format('HH:mm')}`,
        'America/Chicago'
      ).toDate();
      
      const eventTimeCST = moment(time).tz('America/Chicago').format('h:mm A');

      setFormData((prevData) => ({
        ...prevData,
        eventTime: time,
        startTime: combinedDateTime,
        eventTimeCST,
      }));
    } else {
      console.error('Invalid date or time');
    }
  };

  const determineProfile = (data) => {
    let profile = '';

    if (
      data.budget >= 500 &&
      data.guestCount <= 60 &&
      data.hoursNeeded >= 3 &&
      (data.lookingFrom === 'One week' || data.lookingFrom === 'Two weeks' || data.lookingFrom === 'A month') &&
      (data.planningToBook === 'One week' || data.planningToBook === 'Two weeks') &&
      data.helpNeeded === 'Make a reservation'
    ) {
      profile = 'Ideal';
    } else if (
      data.budget >= 500 &&
      data.guestCount <= 60 &&
      data.hoursNeeded >= 3 &&
      (data.lookingFrom === 'One week' || data.lookingFrom === 'Two weeks' || data.lookingFrom === 'A month') &&
      (data.planningToBook === 'One week' || data.planningToBook === 'Two weeks') &&
      (data.helpNeeded === 'Ask the team a question' || data.helpNeeded === 'Learn more about this venue')
    ) {
      profile = 'Middle';
    } else if (
      data.budget >= 500 &&
      data.guestCount <= 60 &&
      data.hoursNeeded >= 3 &&
      (data.lookingFrom === 'One week' || data.lookingFrom === 'Two weeks') &&
      (data.planningToBook === 'Two weeks' || data.planningToBook === 'A month') &&
      (data.helpNeeded === 'Ask the team a question' || data.helpNeeded === 'Learn more about this venue' || data.helpNeeded === 'Make a reservation')
    ) {
      profile = 'Low';
    } else if (
      data.budget >= 500 &&
      data.guestCount <= 60 &&
      data.hoursNeeded >= 3 &&
      (data.lookingFrom === 'One week') &&
      (data.planningToBook === 'A month' || data.planningToBook === 'Two weeks') &&
      (data.helpNeeded === 'Ask the team a question' || data.helpNeeded === 'Learn more about this venue')
    ) {
      profile = 'Super Low';
    } else {
      profile = 'NotIdeal';
    }

    return profile;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading overlay

    const inquiryId = formData.inquiryId;
    if (!inquiryId) {
      console.error('Inquiry ID is missing');
      window.alert('Inquiry ID is missing. Please try again.');
      setIsLoading(false);
      return;
    }

    if (!formData.startTime || isNaN(new Date(formData.startTime).getTime())) {
      console.error('Invalid startTime');
      window.alert('Please provide a valid start time and date.');
      setIsLoading(false);
      return;
    }

    const { isAvailable } = await checkAvailability(formData.startTime, formData.hoursNeeded);
    if (!isAvailable) {
      window.alert('The venue is not available at your selected time.');
      setIsLoading(false);
      return;
    }

    const customerProfile = determineProfile(formData);

    const updatedInquiry = {
      ...formData,
      customerProfile,
      startTime: formData.startTime.toISOString(),
      isAvailable,
      eventTimeCST: formData.eventTimeCST,
    };

    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/17285769/2tyjxvh/';

    try {
      await fetch('/api/qualifyproxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInquiry),
    });

    
      await fetch(`/api/update-inquiry?inquiryId=${inquiryId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...updatedInquiry,
          webhookUrl: zapierWebhookUrl,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const encodedFormData = encodeURIComponent(JSON.stringify(updatedInquiry));
      router.push({
        pathname: '/dynamicoffer',
        query: { data: encodedFormData, inquiryId },
      });
    } catch (error) {
      console.error('Error updating inquiry:', error);
    } finally {
      setIsLoading(false); // Hide loading overlay
    }
  };

  const checkAvailability = async (startTime, eventDuration) => {
    const endDateTime = new Date(startTime.getTime() + eventDuration * 60 * 60 * 1000);

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
    <section className="py-20 bg-gray-100 flex items-center justify-center min-h-screen relative">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-text">Loading...</div>
        </div>
      )}
      <div className="container mx-auto max-w-lg bg-white p-8 rounded shadow-lg relative">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-yellow-600 uppercase">
            Great News, Your Date Has Some Availability <span className="text-red-600">But</span>
          </h2>
          <UrgencyMeter eventDate={formData.eventDate} />
        </div>

        <form className="mt-10" onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-2">Ideal Event Start Time (CST)</label>
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
            <label className="block text-lg text-gray-800 font-bold mb-2">How many hours would be ideal for the full event?</label>
            <input
              type="number"
              name="hoursNeeded"
              value={formData.hoursNeeded}
              onChange={handleChange}
              placeholder="Ex: 6"
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-2">How long have you been looking for a venue?</label>
            <select
              name="lookingFrom"
              value={formData.lookingFrom}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled selected>Select an option</option>
              <option value="One week">One week or less</option>
              <option value="Two weeks">Two weeks to a month</option>
              <option value="A month">Over a month</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-2">When are you planning to book?</label>
            <select
              name="planningToBook"
              value={formData.planningToBook}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled selected>Select an option</option>
              <option value="One week">One week or less</option>
              <option value="Two weeks">Two weeks to a month</option>
              <option value="A month">Over a month</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-lg text-gray-800 font-bold mb-2">What do you need our help with right now?</label>
            <select
              name="helpNeeded"
              value={formData.helpNeeded}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled selected>Select an option</option>
              <option value="Learn more about this venue">Learn more about this venue</option>
              <option value="Ask the team a question">Ask the team a question</option>
              <option value="Make a reservation">Make a reservation</option>
            </select>
          </div>

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
