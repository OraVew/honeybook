'use client'; // Required for Swiper in Next.js 13+

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import ReviewCard from './reviewcard.js';

export default function ReviewList() {
const reviews = [
  {
    name: 'Stacy Hall',
    date: '1 week ago',
    review: 'Great space. Excellent communication with the team highly recommend.',
    platform: 'google',
  },
  {
    name: 'Bonnie S.',
    date: 'September 14, 2024',
    review: 'Great space! Hosts are attentive and respond fast! Highly recommended.',
    platform: 'peerspace',
  },
  {
    name: 'Steenz S.',
    date: 'September 7, 2024',
    review: 'The venue was wonderful. We were able to get in with enough time to set up. All of the facilities worked and it was perfectly private.',
    platform: 'splacer',
  },
  {
    name: 'Olivia N.',
    date: 'August 2024',
    review: 'I liked the look of the place; it had a nice cozy vibe. It also matched the aesthetic of my birthday party.',
    platform: 'tagvenue',
  },
  {
    name: 'Catherine Thomas',
    date: '1 week ago',
    review: 'My 90s party was a hit. The venue was top tier all my guest even was like this is nice. Plenty of parking and the game room is awesome.',
    platform: 'google',
  },
  {
    name: 'Christopher D.',
    date: 'July 2024',
    review: 'Responded very quickly to my enquiry. Made the space available an hour after one had finished. Privacy was perfect.',
    platform: 'tagvenue',
  },
  {
    name: 'Alli 23',
    date: '1 week ago',
    review: 'Absolutely love this venue!! Had such an amazing time hosting my friends with such kind and understanding tenants! Would definitely book here again.',
    platform: 'google',
  },
  {
    name: 'Carmen Polk',
    date: '1 week ago',
    review: 'Abe was really great to work with. It was such a smooth experience. The communication between me and Abe was amazing too. All my guests complimented how the venue looked as well. Will book again!',
    platform: 'google',
  },
  {
    name: 'Svyatoslav Bogdanov',
    date: '2 weeks ago',
    review: 'It was incredibly pleasant to be at this place, very clean and well-maintained. There are plenty of activities, such as a game room and more.',
    platform: 'google',
  },
  {
    name: 'Jessica Lopez',
    date: '2 weeks ago',
    review: "I just hosted a surprise 40th birthday party for my husband and I couldn't have picked a better venue. I had amazing service which really made a surprise event feel easier to plan. I highly recommend!",
    platform: 'google',
  },
  {
    name: 'Create & Curate',
    date: '3 weeks ago',
    review: 'We used OraVew for a surprise birthday gathering of approximately 30 people. It was perfect. The venue comes with so many amenities!',
    platform: 'google',
  },
  {
    name: 'Mariela Alvarez',
    date: '3 weeks ago',
    review: 'Excelente servicio.. super recomendado.. el ambiente es muy lindo. Hice la fiesta de 15 para mi hija y quedo espectacular en el sitio y con el apoyo de Abe.',
    platform: 'google',
  },
  {
    name: 'Courtney Jenkins',
    date: '5 weeks ago',
    review: 'This venue was everything we needed it to be and more! My husband and I held an intimate dinner with friends and family and everyone loved it.',
    platform: 'google',
  },
  {
    name: 'Toy P.',
    date: 'July 9, 2024',
    review: "Abe & Eli's space fit the needs of our team. They were very responsive and helpful. We will book again!",
    platform: 'peerspace',
  },
  {
    name: 'Rose N.',
    date: 'May 19, 2024',
    review: 'Nice space! Attentive staff - thanks for buzzing everyone in!',
    platform: 'peerspace',
  },
  {
    name: 'Gervais P.',
    date: 'May 18, 2024',
    review: 'Everything was great. The space was great. The communication was great.',
    platform: 'peerspace',
  },
  {
    name: 'Kait K.',
    date: 'April 21, 2024',
    review: 'The space was clean and spacious! The hosts were easy to work with and everyone complimented how nice the space was. We had 31 people, and there was plenty of room for mingling.',
    platform: 'peerspace',
  }
];

return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Trusted By</h2>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1 }, // 1 review per slide for smaller screens
            1024: { slidesPerView: 2 }, // 2 reviews per slide for larger screens
          }}
          className="w-full"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <ReviewCard
                name={review.name}
                date={review.date}
                review={review.review}
                platform={review.platform}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}