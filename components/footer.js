import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const scrollToContactForm = (e) => {
    e.preventDefault();
    document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <footer className="bg-gray-100 py-10">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          {/* Logo and Basic Info */}
          <div className="lg:w-1/3 text-center lg:text-left mb-6 lg:mb-0">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              <a>
                <Image
                  src="/logo.png"
                  alt="Expert Team"
                  width={150}
                  height={75}
                  className="rounded-lg"
                />
                <p className="text-gray-600 mt-2">Boutique Event & Venue Space</p>
              </a>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="lg:w-1/3 flex justify-center mb-6 lg:mb-0">
            <nav className="space-x-6">
            <Link href="/contact" className="text-gray-600 hover:text-gray-800">
                Contact
              </Link>
              <a
                href="https://www.instagram.com/theoravew"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                Instagram
              </a>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="lg:w-1/3 text-center lg:text-right">
            <p className="text-gray-600">1000 N Halsted St, Chicago, IL 60642</p>
            <p className="text-gray-600 mt-2">
              Phone: <a href="tel:312-544-9613" className="underline">312-815-3713</a>
            </p>
            <p className="text-gray-600 mt-2">
              Email: <a href="mailto:liv@oravew.com" className="underline">liv@oravew.com</a>
            </p>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="mt-10">
          <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
            <div className="flex-shrink-0 w-64 h-48 bg-gray-300 rounded-lg">
              <Image
                src="/birthday2.jpg"
                alt="Placeholder Image 1"
                width={256}
                height={192}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-shrink-0 w-64 h-48 bg-gray-300 rounded-lg">
              <Image
                src="/dj.jpg"
                alt="Placeholder Image 2"
                width={256}
                height={192}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-shrink-0 w-64 h-48 bg-gray-300 rounded-lg">
              <Image
                src="/zenfest.jpg"
                alt="Placeholder Image 3"
                width={256}
                height={192}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-shrink-0 w-64 h-48 bg-gray-300 rounded-lg">
              <Image
                src="/newhero.webp"
                alt="Placeholder Image 4"
                width={256}
                height={192}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-shrink-0 w-64 h-48 bg-gray-300 rounded-lg">
              <Image
                src="/photobooth.webp"
                alt="Placeholder Image 5"
                width={256}
                height={192}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-shrink-0 w-64 h-48 bg-gray-300 rounded-lg">
              <Image
                src="/4.webp"
                alt="Placeholder Image 6"
                width={256}
                height={192}
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 text-center text-gray-600">
          <p>COPYRIGHT 2024 ORAVEW. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}