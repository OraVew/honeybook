export default function DownsellComponent({ hoursNeeded, dayType, timeOfDay, handleSubmit, budget, eventTime }) {
  const cleaningFee = 150;

  const startHour = eventTime ? parseInt(eventTime.split(':')[0], 10) : 0;

  const calculateBasePrice = (hours, timeOfDay, startHour) => {
    const baseRateBefore10pm = dayType === 'weekday' ? 100 : 125;
    const baseRateAfter10pm = 165;

    if (startHour < 22 && startHour + hours > 22) {
      const hoursBefore10pm = 22 - startHour;
      const hoursAfter10pm = hours - hoursBefore10pm;
      return hoursBefore10pm * baseRateBefore10pm + hoursAfter10pm * baseRateAfter10pm;
    }
    return timeOfDay === 'after-10pm' ? hours * baseRateAfter10pm : hours * baseRateBefore10pm;
  };

  const totalBasePrice = calculateBasePrice(hoursNeeded, timeOfDay, startHour);
  const totalWithCleaning = totalBasePrice + cleaningFee;

  const finalPrice = totalWithCleaning * 0.90; // Apply a 10% discount directly

  return (
    <div className="offer-card">
      <h3>Standard Package</h3>
      <p>Includes the following:</p>
      <ul>
        <li>
          {hoursNeeded} hours: ${totalBasePrice.toFixed(2)} ({dayType}, {timeOfDay})
        </li>
        <li>Cleaning Fee: ${cleaningFee}</li>
      </ul>
      <h4>Total Price: ${finalPrice.toFixed(2)}</h4>
      <button
    onClick={() =>
      handleSubmit('Standard Package', {
        descriptionItems: [`${hoursNeeded} Hours`, 'Cleaning Fee'], // Adding hoursNeeded before 'Hours'
        totalPrice: finalPrice,
      })
    }
  >
        Learn more about this offer
      </button>
    </div>
  );
}
