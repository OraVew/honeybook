'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  // Array of image URLs located in the public folder or via external URLs
  const images = [
    '/hero1.jpg',
    '/bdayhero.jpg',
    '/cocktailhero.jpg',
    '/babyhero2.JPEG',
    '/babyhero.jpg',
    '/zenfest.jpg',
    '/bday6.JPG',
    '/bday1.JPG',
    '/hero.jpg',
    // Add more image URLs as needed
  ];

  // State to track the current background image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to shuffle the background image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Container to hold all the images */}
      <div className="absolute inset-0">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Image
              src={src}
              alt={`Background image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              priority={index === 0} // Only prioritize loading the first image
              style={{ visibility: 'hidden' }} // Hide the actual img tag, we're using the div background
            />
          </div>
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-opacity-50 bg-gray-800">
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: "#D69600" }}>
            A boutique event and venue space in Goose Island Chicago
          </p>
          <h1 className="mt-4 text-6xl font-bold text-white">
            Design your custom event without the stress.
          </h1>
          <button
            className="mt-8 px-6 py-3 bg-[#D69600] text-white font-semibold rounded hover:bg-[#7B61FF]"
            onClick={() =>
              document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' })
            }
          >
            Get a Quote
          </button>
        </div>
      </div>
    </section>
  );
}
