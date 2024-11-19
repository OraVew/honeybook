'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Image from 'next/image';

export default function Hero() {
  const router = useRouter(); // Initialize the router

  // Array of image URLs located in the public folder or via external URLs
  const images = [
    '/hero1.webp', 
    '/marquee.webp',
    '/openhero.webp',
    '/newhero.webp',
    '/photobooth.webp',
    '/gameroom.webp',
    '/bdayhero.webp',
    '/cocktailhero.webp',
    '/babyhero2.webp',
    '/babyhero.webp',
    '/zenfest.webp',
    '/hero.webp',
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

  // Scroll down handler
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Serve smaller sizes on mobile
              style={{ visibility: 'hidden' }} // Hide the actual img tag, we're using the div background
            />
          </div>
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-opacity-50 bg-gray-800">
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: "#D69600" }}>
            A boutique event and venue space in Chicago!
          </p>
          <h1 className="mt-4 text-6xl font-bold text-white">
            Design your custom event without the stress.
          </h1>

          {/* Scroll Down Animation (Using GIF) */}
          <div className="mt-8 flex justify-center items-center cursor-pointer" onClick={handleScrollDown}>
            {/* Add your scroll down GIF */}
            <img
              src="/Test.gif" // Ensure the GIF is in the public folder
              alt="Scroll Down"
              className="w-24 h-24 bg-transparent" // Double the size of the GIF
              style={{ backgroundColor: 'transparent' }} // Extra transparency styling
            />
          </div>
        </div>
      </div>
    </section>
  );
}

