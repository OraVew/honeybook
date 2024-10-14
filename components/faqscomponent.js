import { useState, useRef } from 'react';
import styles from './faqscomponent.module.css';
import FAQs from './faqs';
import { useRouter } from 'next/router';

export default function FAQsComponent({ formData, handleSubmit }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [question, setQuestion] = useState('');
  const [fit, setFit] = useState('');
  const modalRef = useRef(null);
  const router = useRouter();

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setFit(event.target.value);
  };

  const isFormValid = () => {
    return question.length > 0;
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSubmitQuestion = async () => {
    if (checked && formData && formData.inquiryId) {
      const questionData = {
        fit, // Whether the offer is a good fit (Yes/No)
        question, // The actual question submitted
      };
  
      const updatedQuestions = {
        ...formData,
        Questions: [
          ...(formData.Questions || []),
          {
            "Are any of our offers a good fit for your budget, interest, or preference?": fit,
            "What is the most important question you have for Elijah and Abe right now?": question,
          },
        ],
      };
  
      try {
        // Log the data being sent to the backend
        console.log('Sending data to backend:', {
          inquiryId: formData.inquiryId,
          ...updatedQuestions,
        });
  
        const inquiryUpdateResponse = await fetch(`/api/update-question?inquiryId=${formData.inquiryId}`, {
          method: 'PUT',
          body: JSON.stringify({
            inquiryId: formData.inquiryId,
            ...updatedQuestions, // Send the entire updated form data to the backend
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!inquiryUpdateResponse.ok) {
          throw new Error('Failed to update inquiry in MongoDB');
        }
  
        // Redirect to the confirmation page, passing inquiryId
        router.push(`/questionconfirmation?inquiryId=${formData.inquiryId}`);
      } catch (error) {
        console.error('Error submitting question:', error);
      }
    } else {
      alert("Please acknowledge you've reviewed OraVew’s offers.");
    }
  };
  

  return (
    <div className={styles.faqCard}>
      <h3 className={styles.title}>Have a Question?</h3>
      <p className={styles.text}>Are any of our offers a good fit for your budget, interest, or preference?</p>
      <div className={styles.fitOptions}>
        <select value={fit} onChange={handleDropdownChange} className={styles.selectDropdown}>
          <option value="" disabled>
            Select an option
          </option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <p className={styles.text}>What is the most important question you have for Elijah and Abe right now?</p>
      <input
        type="text"
        className={styles.inputField}
        placeholder="How can we help?"
        value={question}
        onChange={handleInputChange}
      />

      <button className={styles.submitButton} onClick={handleModalOpen} disabled={!isFormValid()}>
        Ask Your Question
      </button>

      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent} ref={modalRef}>
            <span className={styles.close} onClick={handleModalClose}>
              &times;
            </span>
            <h2>FAQs</h2>
            <div className={styles.faqScrollable}>
              <FAQs />
            </div>
            <label className={styles.acknowledgeCheckbox}>
              I understand OraVew’s offers
              <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
            </label>

            <button className={styles.submitButton} onClick={handleSubmitQuestion}>
              Submit Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
