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
    customerProfile: '',  // Add customerProfile to the form data
    isAvailable: ''
  });

  const router = useRouter();

  useEffect(() => {
    // Decode the inquiry data passed through the route and set it into the form
    if (router.query.data) {
      const decodedData = JSON.parse(decodeURIComponent(router.query.data));
      setFormData((prevData) => ({
        ...prevData,
        ...decodedData,
      }));
    }

    // Also capture the inquiryId from the route if available
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
      
      const eventTimeCST = moment(time).tz('America/Chicago').format('h:mm A'); // Extract time in CST
  
      setFormData((prevData) => ({
        ...prevData,
        eventTime: time,
        startTime: combinedDateTime,
        eventTimeCST,  // Store the time part as "Event Time CST"
      }));
    } else {
      console.error('Invalid date or time');
    }
  };

  // Function to determine the customer profile based on form data
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
      (data.helpNeeded === 'Ask the team a question'  || data.helpNeeded === 'Learn more about this venue' || data.helpNeeded === 'Make a reservation')
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
  
    // Ensure that _id exists
    const _id = formData._id; // This should be the _id from the Inquiry collection
    if (!_id) {
      console.error('_id is missing');
      window.alert('_id is missing. Please try again.');
      return;
    }
  
    // Ensure that startTime is valid before proceeding
    if (!formData.startTime || isNaN(new Date(formData.startTime).getTime())) {
      console.error('Invalid startTime');
      window.alert('Please provide a valid start time and date.');
      return;
    }
  
    // Check availability before submitting
    const { isAvailable } = await checkAvailability(formData.startTime, formData.hoursNeeded);
    if (!isAvailable) {
      window.alert('The venue is not available at your selected time.');
      return;
    }
  
    // Determine customer profile before submission
    const customerProfile = determineProfile(formData);
  
    // Construct a comprehensive guest message
    const guestMessage = `
      Event Type: ${formData.eventType}
      Guest Count: ${formData.guestCount}
      Budget: ${formData.budget}
      Event Date: ${formData.eventDate}
      Event Time: ${formData.eventTime ? formData.eventTime.toLocaleTimeString() : 'Not specified'}
      Venue Search Duration: ${formData.venueSearchDuration}
      Secure Venue Urgency: ${formData.secureVenueUrgency}
      Help Needed: ${formData.helpNeeded}
      How Did You Find Us: ${formData.howDidYouFindUs}
      Hours Needed: ${formData.hoursNeeded}
      Looking From: ${formData.lookingFrom}
      Planning to Book: ${formData.planningToBook}
      Customer Profile: ${customerProfile}
      Availability: ${isAvailable ? 'Yes' : 'No'}
    `;
  
    // Prepare the new message to be added to the existing inquiry
    const newMessage = {
      timeSent: new Date(),
      guestMessage: guestMessage.trim(), // Trim any extra whitespace
      sender: 'Customer',
      threadId: `${formData.name}-${formData.inquiryId}-Book.OraVew.com`, // Constructed threadId
    };
  
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/17285769/2tyjxvh/';
  
    try {
      // Call the existing update-inquiry API to handle other updates
      await fetch(`/api/update-inquiry`, {
        method: 'PUT',
        body: JSON.stringify({
          _id, // Use _id for the Inquiry collection
          inquiryId: formData.inquiryId,
          ...formData,
          customerProfile,
          isAvailable,
          startTime: formData.startTime.toISOString(),
          eventTimeCST: formData.eventTimeCST,
          webhookUrl: zapierWebhookUrl, // Ensure webhookUrl is included in the request
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Call the new API to add the message to the ChannelManager collection
      await fetch(`/api/update-channel-manager-inquiry`, {
        method: 'PUT',
        body: JSON.stringify({
          inquiryId: formData.inquiryId,
          newMessage,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Trigger the Zapier webhook
      await fetch(zapierWebhookUrl, {
        method: 'POST',
        body: JSON.stringify({
          inquiryId: formData.inquiryId,
          ...formData,
          customerProfile,
          isAvailable,
          startTime: formData.startTime.toISOString(),
          eventTimeCST: formData.eventTimeCST,
          guestMessage: guestMessage.trim(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Redirect to the next page with the updated inquiry data
      const encodedFormData = encodeURIComponent(JSON.stringify(formData));
      router.push({
        pathname: '/dynamicoffer',
        query: { data: encodedFormData, inquiryId: formData.inquiryId },
      });
    } catch (error) {
      console.error('Error updating inquiry:', error);
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
