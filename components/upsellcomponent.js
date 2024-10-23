export default function UpsellComponent({ hoursNeeded, dayType, timeOfDay, handleSubmit, budget, eventTime }) {
  const addOns = {
    gameRoom: 125,
    photoLounge: 125,
    marqueeLights: 100,
  };

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
  const totalWithAddOns = totalBasePrice + addOns.gameRoom + addOns.photoLounge + addOns.marqueeLights + cleaningFee;

  let finalPrice = totalWithAddOns;
  if (finalPrice > budget) {
    finalPrice = totalWithAddOns * 0.8;
  }

  return (
    <div className="offer-card">
      <h3>Custom All-Inclusive Package</h3>
      <p>Includes the following:</p>
      <ul>
        <li>
          {hoursNeeded} hours: ${totalBasePrice.toFixed(2)} ({dayType}, {timeOfDay})
        </li>
        {finalPrice > budget ? null : (
          <>
            <li>Game Room</li>
            <li>Photo Booth</li>
            <li>Marquee Lights</li>
          </>
        )}
        <li>Includes our Cleaning Fee</li>
      </ul>
      <h4>Total Price: ${finalPrice.toFixed(2)}</h4>
      <button
  onClick={() =>
    handleSubmit('Custom All-Inclusive Package', {
      descriptionItems: [`${hoursNeeded} Hours`, 'Game Room', 'Photo Lounge', 'Marquee Lights', 'Cleaning Fee'], // Adding hoursNeeded before 'Hours'
      totalPrice: finalPrice,
    })
  }
>
Learn more about this offer
      </button>
    </div>
  );
}
