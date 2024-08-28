'use client'; // Required for components that use hooks in Next.js 13+

import { useState, useEffect } from 'react';

export default function Hero() {
  // Array of image URLs located in the public folder or via external URLs
  const images = [
    './hero1.jpg',
    './hero.jpg',
    './zenfest.jpg',
    './bday7.JPG',
    './bday1.JPG',
    // Add more image URLs as needed
  ];

  // State to track the current background image
  const [currentImage, setCurrentImage] = useState(images[0]);

  // Function to shuffle the background image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        const currentIndex = images.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 5000); // Change image every 5 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="relative h-screen bg-gray-200">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${currentImage})` }}
      ></div>
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
    </section>
  );
}
