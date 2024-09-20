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
  });

  useEffect(() => {
    // Populate form data from query params if available
    const { name, email, phone, pricingOption, eventDate, eventType } = router.query;
    setFormData((prevData) => ({
      ...prevData,
      name: name || '',
      email: email || '',
      phone: phone || '',
      pricingOption: pricingOption || '',
      eventDate: eventDate || '',
      eventType: eventType || '',
    }));
  }, [router.query]);

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

    // 2. Send data to Zapier or your API via proxy
    const webhookUrl = '/api/add-ons-proxy'; // Replace this with your proxy endpoint

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          inquiryDate: inquiryDate.toISOString(), // Send the Inquiry Date in ISO format
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 3. Redirect to the virtual tour page
      router.push({
        pathname: '/virtualtour', // Redirect to the virtual tour page
        query: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          pricingOption: formData.pricingOption,
          eventDate: formData.eventDate ? formData.eventDate : null, // Send date as is
          eventType: formData.eventType,
          inquiryDate: inquiryDate.toISOString(), // Send the inquiry date and time
        },
      });
    } catch (error) {
      console.error('Error sending data to the webhook:', error);
    }
  };

  return (
    <section className="bg-gray-100">
      <div className="container">
        <h2>Customize Your Event</h2>
        <p>Choose your event layout and add-ons below. We won&apos;t charge you now, but we will estimate your event cost now.</p>
        <p className="event-info-text">Every event comes with 30 chairs, 5 tables, 4 tall boys, 2 couches, a 8x4ft food table, and our sound system.</p>
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
              <p>Includes 30 chairs. Extra chairs cost $2 for regular or $5 for Chivari.</p>
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
              <p>Includes 5 tables. Extra tables cost $10 each.</p>
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
              <p>Includes 4 tall boys. Extra tall boys cost $10 each.</p>
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
          </div>

          <button
            type="submit"
            className="submit-button"
          >
            SUBMIT YOUR LAYOUT
          </button>
        </form>
      </div>
    </section>
  );
}
