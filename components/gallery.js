import Image from 'next/image';
import styles from './gallery.module.css';

const images = [
  '/images/1.webp',
  '/images/2.webp',
  '/images/3.webp',
  '/images/12.webp',
  '/images/4.webp',
  '/images/5.webp',
  '/images/6.webp',
  '/images/7.webp',
  '/images/8.webp',
  '/images/9.webp',
  '/images/10.webp',
  '/images/babyhero.webp',
];

const Gallery = () => {
  return (
    <section className="py-20 bg-gray-200">
    <div className={styles.container}>
    <h2 className="text-4xl font-bold text-gray-800 text-center">Gallery</h2>
      <div className={styles.galleryGrid}>
        {images.map((src, index) => (
          <div key={index} className={styles.galleryItem}>
            <Image 
              src={src} 
              alt={`Gallery Image ${index + 1}`} 
              layout="responsive" 
              width={300} 
              height={200} 
              className={styles.image}
            />
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default Gallery;
