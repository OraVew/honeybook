"use client";
import '../app/globals.css';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../components/eventOfferings.module.css'; // Ensure this is a module import
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function EventOfferings() {
  return (
    <div>
      <Header />

      {/* Event Offerings Section with Background Image and Dark Overlay */}
      <section
        id="event-offerings"
        className={`${styles.section} bg-cover bg-center`}
        style={{ backgroundImage: 'url("/bday1.webp")' }}
      >
        <div className={styles.overlay}></div> {/* Dark overlay */}
        <div className={styles.eventOfferingsCard}> {/* Added eventOfferingsCard */}
          <h1 className={styles.heading}>Expert Team Service</h1>
          <p className={styles.paragraph}>
          A custom event doesn't need to be hard for the host. With your input and our service, we'll create the event you envision.
          </p>
          <p className={`${styles.paragraph}`}>
          We welcome outside caterers and vendors. We can also provide a list of preferred vendors.
          </p>
          <p className={styles.paragraph}>
          Our event coordinator can assist with booking catering, liquor, and photographers.
          </p>
        </div>
      </section>

      {/* Amenities Section with Flexbox Layout */}
      <section id="amenities" className={`${styles.section} bg-white`}>
        <div className={styles.container}>
          <div className={`${styles.flexContainer} flex flex-col md:flex-row gap-8`}>
            <div className={styles.textCenter}>
              <h2 className={styles.heading}>AMENITIES</h2>
              <ul className={styles.list}>
                <li className={styles.listItem}>An open-concept floor plan</li>
                <li className={styles.listItem}>Game room area</li>
                <li className={styles.listItem}>Photo booth room</li>
                <li className={styles.listItem}>Private kitchenette with a microwave, fridge, and sink</li>
                <li className={styles.listItem}>BYOB & outside catering welcome</li>
                <li className={styles.listItem}>Bluetooth sound system</li>
                <li className={styles.listItem}>Free parking lot</li>
                <li className={styles.listItem}>Sectional lights</li>
                <li className={styles.listItem}>Large windows with city views</li>
                <li className={styles.listItem}>Open until 2am</li>
              </ul>
            </div>
            <div className={styles.imageContainer}>
              <Image
                src="/hero.webp"
                alt="Event Amenities"
                width={600}
                height={400}
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Background Image, Dark Overlay, and White Card */}
      <section
        id="pricing"
        className={`${styles.section} bg-cover bg-center`}
        style={{ backgroundImage: 'url("/standard3.png")' }}
      >
        <div className={styles.overlay}></div> {/* Dark overlay */}
        <div className={styles.pricingCard}>
          <h2 className={styles.heading}>PRICING</h2>
          <p className={styles.paragraph}>Our rental fee is priced per hour. Four-hour minimum required.</p>

          {/* Standard Pricing */}
          <div className="mt-8">
            <h3 className={styles.subheading}>Venue Rental</h3>
            <p className={styles.paragraph}>Weekdays: $100/hour</p>
            <p className={styles.paragraph}>Weekends: $125/hour</p>
            <p className={styles.paragraph}>Late Night (10pm-2am): $165/hour</p>
          </div>

          {/* Add-ons Pricing */}
          <div className="mt-8">
            <h3 className={styles.subheading}>Optional Add-ons</h3>
            <p className={styles.paragraph}>Game Room: $125 flat</p>
            <p className={styles.paragraph}>Photo Booth Room: $125 flat</p>
            <p className={styles.paragraph}>Birthday Numbers Marquee Lights: $100 flat</p>
          </div> 

          {/* Special Packages */}
          <div className="mt-8">
            <h3 className={styles.subheading}>Special Packages</h3>
            <p className={styles.paragraph}>
              <strong>Happy Birthday Package</strong>
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>6 hours, Game Room, Photo Lounge, and Marquee Lights</li>
              <li className={styles.listItem}>$1000 before 10pm or $1128 for hours after 10pm</li>
              </ul>
            <p className={styles.paragraph}>
              <strong>Baby Shower Package</strong>
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>4 hours, Game Room, Photo Lounge, and Baby Block decor centerpieces</li>
              <li className={styles.listItem}>$700 before 6pm or $825 after 6pm</li>
              </ul>
          </div>
          <br/>
          <Link href="/contact">
                <a className={`${styles.button} ${styles.buttonCentered}`}>
                  Book Now
                </a>
              </Link>
        </div>
      </section>

      {/* FAQs Section with Flexbox Layout */}
      <section id="faqs" className={`${styles.section}`}>
        <div className={styles.container}>
          <div className={`${styles.flexContainer} flex flex-col md:flex-row gap-8`}>
            <div className={styles.textCenter}>
              <h2 className={styles.heading}>QUESTIONS? WE'VE GOT ANSWERS</h2>
              <p className={styles.paragraph}>
                Get answers to the most commonly asked questions. Still not finding what you
                need? Just contact us and we can help!
              </p>
              <br/>
              <Link href="/faq">
                <a className={`${styles.button} ${styles.buttonCentered}`}>
                  Read FAQs
                </a>
              </Link>
            </div>
            <div className={styles.imageContainer}>
              <Image
                src="/images/5.webp"
                alt="FAQs"
                width={600}
                height={400}
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
