import '../app/globals.css';
import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-creative';

export default function ReviewsVideo() {
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);
  const swiperRef = useRef(null);

  const handleStart = () => {
    setStarted(true);
    // Play audio
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    }
    // Start swiper autoplay
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.start();
    }
  };

  // Generate array of 20 review images
  const reviews = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    image: `/reviews/review${i + 1}.png`
  }));

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Audio element */}
      <audio
        ref={audioRef}
        src="/reviews/Maria.MP3"
        loop
        preload="auto"
      />

      {/* 9:16 Container - Full width on mobile, constrained on desktop */}
      <div className="relative w-full md:max-w-[1080px] aspect-[9/16] bg-black overflow-hidden">

        {/* Start Button Overlay */}
        {!started && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
            <button
              onClick={handleStart}
              className="px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl md:text-2xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out"
            >
              ▶ Start Video
            </button>
          </div>
        )}

        {/* Swiper Carousel */}
        <Swiper
          ref={swiperRef}
          direction="vertical"
          slidesPerView={1}
          speed={800}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          effect="creative"
          creativeEffect={{
            prev: {
              translate: [0, '-100%', 0],
              opacity: 0,
            },
            next: {
              translate: [0, '100%', 0],
              opacity: 0,
            },
          }}
          loop={true}
          modules={[Autoplay, EffectCreative]}
          className="w-full h-full"
          allowTouchMove={false}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="w-full h-full flex items-center justify-center p-3 md:p-8 bg-black">
                <div className="relative w-full h-auto">
                  <img
                    src={review.image}
                    alt={`Review ${review.id}`}
                    className="w-full h-auto object-contain rounded-lg md:rounded-2xl shadow-2xl"
                    style={{
                      maxHeight: '95vh',
                      filter: 'brightness(1.05) contrast(1.05)',
                    }}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
