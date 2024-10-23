export default function SpecialPackagesComponent({ eventType, timeOfDay, handleSubmit }) {
  let totalPrice;
  let descriptionItems = [];

  if (eventType === 'Birthday') {
    if (timeOfDay === 'before-10pm') {
      totalPrice = 1000;
      descriptionItems = ['6 hours', 'Game Room', 'Photo Lounge', 'Marquee Lights', '20% discount', 'Cleaning fee'];
    } else {
      totalPrice = 1128;
      descriptionItems = ['After 10PM Special', '6 hours', 'Game Room', 'Photo Lounge', 'Marquee Lights', '20% discount', 'Cleaning fee'];
    }
  } else if (eventType === 'Baby Shower') {
    if (timeOfDay === 'before-6pm') {
      totalPrice = 700;
      descriptionItems = ['4 hours', 'Game Room', 'Photo Lounge', 'Baby Block decor centerpieces', '20% discount', 'Cleaning fee'];
    } else {
      totalPrice = 825;
      descriptionItems = ['After 6PM Special', '4 hours', 'Game Room', 'Photo Lounge', 'Baby Block decor centerpieces', '20% discount' , 'Cleaning fee'];
    }
  }

  return (
    <div className="offer-card">
      <h3>{eventType} Package</h3>
      <p>Includes the following:</p>
      <ul>
        {descriptionItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h4>Total Price: ${totalPrice}</h4>
      <button onClick={() => handleSubmit(`${eventType} Package`, { descriptionItems, totalPrice })}>
      Learn more about this offer
      </button>
    </div>
  );
}
