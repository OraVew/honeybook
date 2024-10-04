// Updated UrgencyMeter.jsx
import styles from './urgencymeter.module.css';

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

export default function UrgencyMeter({ eventDate }) {
  return (
    <div className={styles.urgencyContainer}>
      <h3 className={styles.heading}>We have other inquires open</h3>
      <div className={styles.activities}>
        <div className={styles.activityItem}>
          <p className={`${styles.number} ${styles.red}`}>17</p>
          <p className={styles.label}>Inquiries this week</p>
        </div>
        <div className={styles.divider}></div> {/* Divider line */}
        <div className={styles.activityItem}>
          <p className={`${styles.number} ${styles.purple}`}>2</p>
          <p className={styles.label}>Inquiries for {formatDate(eventDate) || 'TBD'}</p>
        </div>
        <div className={styles.divider}></div> {/* Divider line */}
        <div className={styles.activityItem}>
          <p className={`${styles.number} ${styles.green}`}>7</p>
          <p className={styles.label}>Tours this week</p>
        </div>
      </div>
      <div className={styles.urgencyText}>
        <p className={`${styles.speedUpText} ${styles.redText}`}>
          You can skip the line by answering a few additional questions so our team can assist you faster!
        </p>
      </div>
    </div>
  );
}

  
