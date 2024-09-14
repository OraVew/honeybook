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
    }, 5000); // Change image every 5 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-screen bg-gray-200">
      {/* Preload images */}
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Background image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          priority={index === 0} // Only prioritize loading the first image
          style={{ display: 'none' }} // Hide images from view; they are only preloaded
        />
      ))}

      {/* Background transition */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url(${images[currentIndex]})`,
          opacity: 1,
          animation: 'fade 5s ease-in-out infinite'
        }}
      ></div>

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
            Book Your Event
          </button>
        </div>
      </div>

      {/* Add keyframes for fade transition */}
      <style jsx>{`
        @keyframes fade {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
