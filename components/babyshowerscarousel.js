// components/BabyShowerCarousel.js

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export default function BabyShowerCarousel() {
  const babyShowerEvents = [
    {
      title: "Kelly's Baby Shower",
      description: 'A beautiful celebration to welcome baby Emma.',
      image: '/babyshowers/babyshower1.jpeg',
    },
    {
      title: "Kelly's Baby Shower",
      description: 'A beautiful celebration to welcome baby Emma.',
      image: '/babyshowers/babyshower2.jpg',
    },
    {
      title: 'Boy on the Way',
      description: 'Double the joy at this baby boy-themed shower.',
      image: '/babyshowers/babyshower3.png',
    },
    {
      title: "Kelly's Baby Shower",
      description: 'A beautiful celebration to welcome baby Emma.',
      image: '/babyshowers/babyshower4.jpeg',
    },
    // Add more baby shower events here
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Baby Showers</h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          className="w-full"
        >
          {babyShowerEvents.map((event, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col md:flex-row items-center h-auto">
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
                
                <div className="relative w-full md:w-1/2 flex justify-center">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
