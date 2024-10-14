import { useRouter } from 'next/router';
import styles from '../components/questionconfirmation.module.css'; // Import CSS module

export default function QuestionConfirmation() {
  const router = useRouter();
  const { inquiryId } = router.query; // Get the inquiryId from the route parameters

  const handleReviewInquiry = () => {
    // Redirect to the event-brochure page, passing the inquiryId in the URL
    router.push(`/event-brochure?id=${inquiryId}`);
  };

  return (
    <section className={styles.confirmationSection}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Thank You!</h2>
        <p className={styles.text}>
          Your question has been received. Elijah and Abe will get back to you ASAP.
        </p>

        <button className={styles.button} onClick={handleReviewInquiry}>
          Review Inquiry
        </button>
      </div>
    </section>
  );
}
