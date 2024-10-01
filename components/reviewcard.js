import Image from 'next/image';
import styles from './reviewcard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

// Correct paths to the logos in the public folder
const platformLogos = {
  google: '/images/google.svg',
  peerspace: '/images/peerspace.svg',
  tagvenue: '/images/tagvenue.svg',
  splacer: '/images/splacer.svg',
};

const ReviewCard = ({ name, date, review, platform }) => {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          {/* Platform logo */}
          {platformLogos[platform] && (
            <Image
              src={platformLogos[platform]}
              alt={`${platform} logo`}
              width={200}
              height={80}
              className="mr-4"
            />
          )}
          <div>
            <h3 className={styles.reviewerName}>{name}</h3>
            <p className={styles.reviewDate}>{date}</p>
          </div>
        </div>
  
        {/* Star rating */}
        <div className={styles.stars}>
          {'★★★★★'} {/* Simple placeholder for a 5-star rating, replace with star icons if needed */}
        </div>
  
        <p className={styles.reviewText}>{review}</p>
      </div>
    );
  };
  
  export default ReviewCard;