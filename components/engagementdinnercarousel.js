// components/EngagementDinnerCarousel.js

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export default function EngagementDinnerCarousel() {
  const engagementEvents = [
    {
      title: "Sarah & Michael's Engagement",
      description: 'An intimate dinner celebrating Sarah and Michael’s love.',
      image: '/dinners/dinner1.jpg',
    },
    {
      title: "Sarah & Michael's Engagement",
      description: 'An intimate dinner celebrating Sarah and Michael’s love.',
      image: '/dinners/dinner2.jpg',
    },
    {
      title: "Sarah & Michael's Engagement",
      description: 'An intimate dinner celebrating Sarah and Michael’s love.',
      image: '/dinners/dinner3.jpg',
    },
    {
      title: 'Love in Bloom',
      description: 'A romantic evening marking the start of a beautiful journey.',
      image: '/dinners/dinner4.png',
    },
    // Add more engagement events here
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Engagement Dinners</h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          className="w-full"
        >
          {engagementEvents.map((event, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col md:flex-row items-center h-auto">
                <div className="relative w-full md:w-1/2 flex justify-center">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-6 md:mt-0 md:ml-10 flex flex-col justify-center w-full md:w-1/2">
                  <h3 className="text-3xl font-semibold text-gray-800">{event.title}</h3>
                  <p className="mt-4 text-gray-600">{event.description}</p>
                  <div className="mt-6">
                    <a
                      href="#"
                      className="inline-block px-6 py-3 bg-[#D69600] text-white font-semibold rounded-lg hover:bg-[#7B61FF]"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Get Quote
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
