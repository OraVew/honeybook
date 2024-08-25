import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-100">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            <a>
              <Image
                src="/logo.png"
                alt="Expert Team"
                
                className="rounded-lg h-10"
              />
            </a>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6">
          {/* Add Navigation Links Here */}
        </nav>

        {/* Instagram Icon */}
        <Link href="https://www.instagram.com/theoravew" target="_blank" rel="noopener noreferrer">
          <a className="hidden lg:block text-gray-600 hover:text-gray-800">
            <i className="fab fa-instagram"></i>
          </a>
        </Link>

        {/* Book Your Event Button */}
        <button
          className="hidden lg:block ml-4 bg-[#D69600] text-white px-4 py-2 rounded hover:bg-[#7B61FF]"
          onClick={() => document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' })}
        >
          Book Your Event
        </button>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-[#7B61FF] bg-[#D69600] hover:bg-[#7B61FF] focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>
    </header>
  );
}
