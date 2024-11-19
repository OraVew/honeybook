import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Components for different customer types
import UpsellComponent from './upsellcomponent';
import DownsellComponent from './downsellcomponent';
import FAQsComponent from './faqscomponent';
import NotIdealComponent from './notidealcomponent';
import SpecialPackagesComponent from './specialpackagescomponent';
import moment from 'moment';  // Import moment.js for time calculations
import './deposittour.css'; // Import the new CSS file

export default function hmykyDynamicOfferForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // State for loading overlay
  const [customerProfile, setCustomerProfile] = useState(''); 
  const [timeOfDay, setTimeOfDay] = useState('');  
  const [dayType, setDayType] = useState(''); 
  const [formData, setFormData] = useState({
    eventDate: '',
    name: '',     
    email: '',
    phone: '',    
    eventTime: '',   
    startTime: '',    
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
  });

  useEffect(() => {
    if (router.query.data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(router.query.data));
  
        setFormData({
          eventDate: decodedData.eventDate || '',         
          name: decodedData.name || '',                   
          email: decodedData.email || '',                 
          phone: decodedData.phone || '',                 
          eventTime: decodedData.eventTime || '',         
          startTime: decodedData.startTime || '',         
          helpNeeded: decodedData.helpNeeded || '',       
          inquiryId: decodedData.inquiryId || '',         
          guestCount: Number(decodedData.guestCount) || 0, 
          budget: Number(decodedData.budget) || 0,        
          howDidYouFindUs: decodedData.howDidYouFindUs || '', 
          eventType: decodedData.eventType || '',         
          inquiryDate: decodedData.inquiryDate || '',     
          hoursNeeded: Number(decodedData.hoursNeeded) || 0, 
          lookingFrom: decodedData.lookingFrom || '',     
          planningToBook: decodedData.planningToBook || '',
        });
        
        calculateTimeOfDay(decodedData.eventTime, decodedData.hoursNeeded);
        calculateDayType(decodedData.eventDate);
        determineProfile(decodedData);  
      } catch (error) {
        console.error('Error decoding data:', error);
      }
    }
  }, [router.query.data]);

  const calculateTimeOfDay = (startTime, hours) => {
    if (!startTime || !hours) return;
    const startMoment = moment(startTime, 'HH:mm');
    const endMoment = startMoment.clone().add(hours, 'hours');  
    if (endMoment.isAfter(moment('22:00', 'HH:mm'))) {
      setTimeOfDay('after-10pm');
    } else {
      setTimeOfDay('before-10pm');
    }
  };

  const calculateDayType = (eventDate) => {
    const eventMoment = moment(eventDate, 'YYYY-MM-DD');
    const isWeekend = eventMoment.isoWeekday() >= 6; 
    setDayType(isWeekend ? 'weekend' : 'weekday');
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
  
    setFormData((prevData) => ({
      ...prevData,
      customerProfile: profile,
    }));
  
    setCustomerProfile(profile);
  };

  const handleSubmit = async (offerName, offerDetails) => {
    setIsLoading(true); // Show loading overlay
    const inquiryDate = new Date();
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/17285769/21h7vza/';
    
    const offerObject = {
      name: offerName,
      totalPrice: offerDetails.totalPrice,
      descriptionItems: offerDetails.descriptionItems
    };
  
    try {
      const response = await fetch(`/api/update-inquiry?inquiryId=${formData.inquiryId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          inquiryDate: inquiryDate.toISOString(),
          selectedOffer: offerObject,
          webhookUrl: zapierWebhookUrl,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to update inquiry in MongoDB');
      }
  
      router.push(`/event-brochure?id=${formData.inquiryId}`);
    } catch (error) {
      console.error('Error submitting offer:', error);
    } finally {
      setIsLoading(false); // Hide loading overlay
    }
  };

  return (
    <section className="offer-section relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-lg font-bold">Loading...</div>
        </div>
      )}
      {/* Customer Profile: Ideal */}
      {customerProfile === 'Ideal' && (
        <>
          <h2>Great Offers for You!</h2>
          {['Birthday', 'Baby Shower'].includes(formData.eventType) && (
            <SpecialPackagesComponent 
              eventType={formData.eventType} 
              timeOfDay={timeOfDay} 
              handleSubmit={handleSubmit} 
            />
          )}
          
          <UpsellComponent 
            handleSubmit={handleSubmit} 
            hoursNeeded={formData.hoursNeeded} 
            dayType={dayType} 
            timeOfDay={timeOfDay} 
            budget={formData.budget} 
            eventTime={formData.eventTime} 
            discount={15}
          />
         
          <DownsellComponent 
            handleSubmit={handleSubmit} 
            hoursNeeded={formData.hoursNeeded} 
            dayType={dayType} 
            timeOfDay={timeOfDay} 
            budget={formData.budget} 
            eventTime={formData.eventTime}
          />
          <FAQsComponent formData={formData} // Pass formData as a prop 
  handleSubmit={handleSubmit} />
        </>
      )}

      {/* Customer Profile: Middle */}
      {customerProfile === 'Middle' && (
        <>
          <h2>We have some great options for you!</h2>
          {['Birthday', 'Baby Shower'].includes(formData.eventType) && (
            <SpecialPackagesComponent 
              eventType={formData.eventType} 
              timeOfDay={timeOfDay} 
              handleSubmit={handleSubmit} 
            />
          )}
          <UpsellComponent 
            handleSubmit={handleSubmit} 
            hoursNeeded={formData.hoursNeeded} 
            dayType={dayType} 
            timeOfDay={timeOfDay} 
            budget={formData.budget} 
            eventTime={formData.eventTime} 
            discount={20}
          />
          <DownsellComponent 
            handleSubmit={handleSubmit} 
            hoursNeeded={formData.hoursNeeded} 
            dayType={dayType} 
            timeOfDay={timeOfDay} 
            budget={formData.budget} 
            eventTime={formData.eventTime}
          />
          <FAQsComponent handleSubmit={handleSubmit} />
         
        </>
      )}

      {/* Customer Profile: Low or Super Low */}
      {(customerProfile === 'Low' || customerProfile === 'Super Low') && (
        <>
          <h2>We’re still a fit! Check these options:</h2>
          <DownsellComponent 
            handleSubmit={handleSubmit} 
            hoursNeeded={formData.hoursNeeded} 
            dayType={dayType} 
            timeOfDay={timeOfDay} 
            budget={formData.budget} 
            eventTime={formData.eventTime}
          />
          {['Birthday', 'Baby Shower'].includes(formData.eventType) && (
            <SpecialPackagesComponent 
              eventType={formData.eventType} 
              timeOfDay={timeOfDay} 
              handleSubmit={handleSubmit} 
            />
          )}
          <UpsellComponent 
            handleSubmit={handleSubmit} 
            hoursNeeded={formData.hoursNeeded} 
            dayType={dayType} 
            timeOfDay={timeOfDay} 
            budget={formData.budget} 
            eventTime={formData.eventTime} 
            discount={25}
          />
          <FAQsComponent handleSubmit={handleSubmit} />
        </>
      )}

      {/* Customer Profile: Not Ideal */}
      {customerProfile === 'NotIdeal' && (
        <>
        <NotIdealComponent />
        {['Birthday', 'Baby Shower'].includes(formData.eventType) && (
            <SpecialPackagesComponent 
              eventType={formData.eventType} 
              timeOfDay={timeOfDay} 
              handleSubmit={handleSubmit} 
            />
          )}
          <UpsellComponent 
            handleSubmit={handleSubmit} 
            hoursNeeded={formData.hoursNeeded} 
            dayType={dayType} 
            timeOfDay={timeOfDay} 
            budget={formData.budget} 
            eventTime={formData.eventTime} 
            discount={20}
          />
          <DownsellComponent 
            handleSubmit={handleSubmit} 
            hoursNeeded={formData.hoursNeeded} 
            dayType={dayType} 
            timeOfDay={timeOfDay} 
            budget={formData.budget} 
            eventTime={formData.eventTime}
          />
          <FAQsComponent handleSubmit={handleSubmit} />
        </>
        
      )}
    </section>
  );
}
