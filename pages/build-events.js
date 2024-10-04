import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import '../components/build-events.css';

export default function BuildEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pricingOption: '',
    eventTime: '',
    eventDate: '',
    eventType: '',
    extraChairs: 0,
    chairType: 'regular', // Options: 'regular', 'chivari'
    extraTables: 0,
    extraTallBoys: 0,
    gameRoom: false,
    photoBooth: false,
    photographer: false,
    marqueeLights: false,
    babyShowerCenterpieces: 0,
    coPlannerName: '',   // Co-planner's name
    coPlannerPhone: '',  // Co-planner's phone
    photoBooth360: false, // New add-on 360 Photo Booth
    instantPrintCamera: false, // New add-on Instant Print Camera
  });

  useEffect(() => {
    // Populate form data from query params if available
    const {
      name,
      email,
      phone,
      pricingOption,
      eventTime,
      eventDate,
      eventType,
      coPlannerName,
      coPlannerPhone,
    } = router.query;
    setFormData((prevData) => ({
      ...prevData,
      name: name || '',
      email: email || '',
      phone: phone || '',
      pricingOption: pricingOption || '',
      eventTime: eventTime || '', // Save eventTime in formData
      eventDate: eventDate || '',
      eventType: eventType || '',
      coPlannerName: coPlannerName || '',
      coPlannerPhone: coPlannerPhone || '',
    }));
  }, [router.query]);

  // Function to calculate the estimated total with a detailed breakdown
  const calculateEstimatedTotal = () => {
    let total = 0;
    let breakdown = {};

    // Pricing Option Base Price
    switch (formData.pricingOption) {
      case 'Standard Hourly':
        total += 625; // Flat rate for Standard Hourly
        breakdown['Standard Hourly Package'] = '$625';
        break;
      case 'All Inclusive':
        total += 899; // Flat rate for All Inclusive
        breakdown['All Inclusive Package'] = '$899';
        break;
      case 'VIP Experience':
        total += 2999; // Flat rate for VIP Experience
        breakdown['VIP Experience Package'] = '$2999';
        break;
      default:
        break;
    }

    // Add-ons Calculations
    if (formData.extraChairs > 0) {
      const chairCost = formData.extraChairs * (formData.chairType === 'regular' ? 2 : 5);
      total += chairCost;
      breakdown['Extra Chairs'] = `$${chairCost} (${formData.extraChairs} x ${formData.chairType === 'regular' ? '$2' : '$5'})`;
    }

    if (formData.extraTables > 0) {
      const tableCost = formData.extraTables * 10;
      total += tableCost;
      breakdown['Extra Tables'] = `$${tableCost} (${formData.extraTables} x $10)`;
    }

    if (formData.extraTallBoys > 0) {
      const tallBoyCost = formData.extraTallBoys * 10;
      total += tallBoyCost;
      breakdown['Extra Tall Boys'] = `$${tallBoyCost} (${formData.extraTallBoys} x $10)`;
    }

    // Game Room and Photo Lounge cost only if Standard Hourly
    if (formData.pricingOption === 'Standard Hourly') {
      if (formData.gameRoom) {
        total += 200;
        breakdown['Game Room'] = '$200';
      }
      if (formData.photoBooth) {
        total += 150;
        breakdown['Photo Lounge Room'] = '$150';
      }
    }

    if (formData.photographer) {
      total += 250;
      breakdown['Photographer'] = '$250';
    }

    if (formData.marqueeLights) {
      total += 100;
      breakdown['Marquee Lights'] = '$100';
    }

    if (formData.babyShowerCenterpieces > 0) {
      const centerpieceCost = formData.babyShowerCenterpieces * 10;
      total += centerpieceCost;
      breakdown['Baby Shower Centerpieces'] = `$${centerpieceCost} (${formData.babyShowerCenterpieces} x $10)`;
    }

    // New Add-ons
    if (formData.photoBooth360) {
      total += 300;
      breakdown['360 Photo Booth'] = '$300';
    }

    if (formData.instantPrintCamera) {
      total += 150;
      breakdown['Instant Print Camera'] = '$150';
    }

    return {
      total,
      breakdown,
    };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Capture the current date and time for "Inquiry Date"
    const inquiryDate = new Date(); // This will store the current date and time

    // 2. Calculate the estimated total with breakdown
    const { total, breakdown } = calculateEstimatedTotal();

    // 3. Send data to Zapier or your API via proxy (webhook)
    const webhookUrl = '/api/add-ons-proxy'; // Replace this with your proxy endpoint

    try {
      // Webhook request
      await fetch(webhookUrl, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          inquiryDate: inquiryDate.toISOString(), // Send the Inquiry Date in ISO format
          estimatedTotal: total, // Send the estimated total
          estimatedBreakdown: breakdown, // Send the detailed breakdown
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 4. Save to MongoDB (extra API call)
      const saveInquiryResponse = await fetch('/api/save-inquiry', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          inquiryDate: inquiryDate.toISOString(),
          estimatedTotal: total,
          estimatedBreakdown: breakdown,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await saveInquiryResponse.json();
      if (saveInquiryResponse.ok) {
        console.log('Inquiry saved with ID:', data.id);

        // Redirect to the event-brochure page with query params
        router.push({
          pathname: '/event-brochure',
          query: { id: data.id }, // Ensure data.id is correct
        });
        
      } else {
        console.error('Failed to save inquiry:', data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <section className="bg-gray-100">
    <div className="container">
      <h2>Lastly, Customize Your Event</h2>
      <p>Choose any decorations, furnitures, or photography you want us to provide for your event below.</p>
      <p className="event-info-text">Every event comes with 30 chairs, 5 tables, 4 tall boys, 2 couches, 8x4ft food table, and our Bluetooth sound system included.</p>
      {/* Floor Plan Image */}
      <div className="floor-plan">
        <Image
          src="/images/floorplan1.jpg" // Replace with your actual image path
          alt="Event Floor Plan"
          width={800}  // Set appropriate width for larger screens
          height={500} // Set appropriate height for larger screens
          className="rounded shadow-lg w-full md:w-2/3" // Make it responsive for mobile
        />
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          {/* Chairs */}
          <div className="card">
            <Image src="/images/chairs.jpg" alt="Chairs" width={300} height={300} className="rounded"/>
            <h3>Additional Chairs</h3>
            <p>Every event includes 30 regular chairs. Extra chairs cost $2 for regular or $5 for Chivari. (If you want every guest seated with Chivari, make sure you choose the number of guests here.)</p>
            <label>
              <span>How many extra chairs?</span>
              <input
                type="number"
                name="extraChairs"
                min="0"
                value={formData.extraChairs}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Chair type</span>
              <select
                name="chairType"
                value={formData.chairType}
                onChange={handleChange}
              >
                <option value="regular">Regular ($2/chair)</option>
                <option value="chivari">Chivari ($5/chair)</option>
              </select>
            </label>
          </div>

          {/* Tables */}
          <div className="card">
            <Image src="/images/tables.jpg" alt="Tables" width={300} height={300} className="rounded"/>
            <h3>Additional Tables</h3>
            <p>Every event includes 5 tables. Extra tables cost $10 each.</p>
            <label>
              <span>How many extra tables?</span>
              <input
                type="number"
                name="extraTables"
                min="0"
                value={formData.extraTables}
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Tall Boys */}
          <div className="card">
            <Image src="/images/tallboys.jpg" alt="Tall Boys" width={300} height={300} className="rounded"/>
            <h3>Additional Tall Boys</h3>
            <p>Every event includes 4 tall boys. Extra tall boys cost $10 each.</p>
            <label>
              <span>How many extra tall boys?</span>
              <input
                type="number"
                name="extraTallBoys"
                min="0"
                value={formData.extraTallBoys}
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Game Room */}
          <div className="card">
            <Image src="/images/gameroom.jpg" alt="Game Room" width={300} height={300} className="rounded"/>
            <h3>Game Room</h3>
            <p>$200 (*Included in All-Inclusive package at no additional cost)</p>
            <label>
              <input
                type="checkbox"
                name="gameRoom"
                checked={formData.gameRoom}
                onChange={handleChange}
              />
              <span>Add Game Room</span>
            </label>
          </div>

          {/* Photo Booth */}
          <div className="card">
            <Image src="/images/photobooth.jpg" alt="Photo Booth" width={300} height={300} className="rounded"/>
            <h3>Photo Lounge Room</h3>
            <p>$150 (*Included in All-Inclusive package at no additional cost)</p>
            <label>
              <input
                type="checkbox"
                name="photoBooth"
                checked={formData.photoBooth}
                onChange={handleChange}
              />
              <span>Add Photo Booth Room</span>
            </label>
          </div>

          {/* Photographer */}
          <div className="card">
            <Image src="/images/photographer.jpg" alt="Photographer" width={300} height={300} className="rounded"/>
            <h3>Photographer</h3>
            <p>$250 for event coverage.</p>
            <label>
              <input
                type="checkbox"
                name="photographer"
                checked={formData.photographer}
                onChange={handleChange}
              />
              <span>Add Photographer</span>
            </label>
          </div>

          {/* Marquee Lights */}
          <div className="card">
            <Image src="/images/marqueelights.jpg" alt="Marquee Lights" width={300} height={300} className="rounded"/>
            <h3>Marquee Lights</h3>
            <p>$100 for your birthday numbers.</p>
            <label>
              <input
                type="checkbox"
                name="marqueeLights"
                checked={formData.marqueeLights}
                onChange={handleChange}
              />
              <span>Add Marquee Lights</span>
            </label>
          </div>

          {/* Baby Shower Centerpieces */}
          <div className="card">
            <Image src="/images/centerpieces.jpg" alt="Baby Shower Centerpieces" width={300} height={300} className="rounded"/>
            <h3>Baby Shower Table Centerpieces</h3>
            <p>$10 per table piece.</p>
            <label>
              <span>How many centerpieces?</span>
              <input
                type="number"
                name="babyShowerCenterpieces"
                min="0"
                value={formData.babyShowerCenterpieces}
                onChange={handleChange}
              />
            </label>
          </div>

          {/* New Add-ons */}
          <div className="card">
            <Image src="/images/photobooth360.png" alt="360 Photo Booth" width={300} height={300} className="rounded"/>
            <h3>360 Photo Booth</h3>
            <p>$300 for the event</p>
            <label>
              <input
                type="checkbox"
                name="photoBooth360"
                checked={formData.photoBooth360}
                onChange={handleChange}
              />
              <span>Add 360 Photo Booth</span>
            </label>
          </div>

          <div className="card">
            <Image src="/images/instantprintcamera.png" alt="Instant Print Camera" width={300} height={300} className="rounded"/>
            <h3>DIY Instant Print Camera Rental</h3>
            <p>$150 for 20 prints</p>
            <label>
              <input
                type="checkbox"
                name="instantPrintCamera"
                checked={formData.instantPrintCamera}
                onChange={handleChange}
              />
              <span>Add Instant Print Camera</span>
            </label>
          </div>

        </div>

        <button
          type="submit"
          className="submit-button"
        >
          SUBMIT YOUR EVENT
        </button>
      </form>
    </div>
  </section>
  );
}
