// /api/save-inquiry.js
import clientPromise from '../../lib/mongodb';
import { formatPhoneNumberToE164 } from '../../services/phoneNumberService';
import { notifyTeam } from '../../services/twilioService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('BookOraVew');

      const inquiryData = req.body;

      // Format phone and replyTo fields to E.164
      let formattedPhone;
      try {
        formattedPhone = formatPhoneNumberToE164(inquiryData.phone);
        console.log('Formatted Phone Number:', formattedPhone);
      } catch (error) {
        console.error('Phone number formatting error:', error.message);
        return res.status(400).json({ error: 'Invalid phone number format.' });
      }

      // Format eventDateAndTime to a human-readable format
      const eventDate = new Date(inquiryData.eventDate);
      const formattedEventDate = eventDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      // Insert the inquiry data into the "Inquiry" collection
      const result = await db.collection('Inquiry').insertOne({
        ...inquiryData,
        phone: formattedPhone, // Save formatted phone
      });

      // Create a structured object for the "ChannelManager" collection
      const channelManagerData = {
        inquiryId: result.insertedId.toString(), // Unique identifier
        customerName: inquiryData.name,
        replyTo: formattedPhone, // Using formatted phone as 'replyTo'
        phone: formattedPhone, // Save formatted phone
        email: inquiryData.email,
        eventDateAndTime: formattedEventDate, // Human-readable format
        attendeeCount: parseInt(inquiryData.guestCount, 10),
        payout: inquiryData.budget,
        addOns: '', // Fill this in as needed
        platform: 'Book.OraVew.com', // Fill this in as needed
        threadId: result.insertedId.toString(), // Fill this in as needed or generate one if necessary
        inquiryStatus: 'new', // Default status
        messages: [
          {
            timeSent: new Date(),
            guestMessage: `I am hosting a ${inquiryData.eventType}, with budget of ${inquiryData.budget}, requesting to be contacted by this ${inquiryData.bestTimeToContact}`,
            sender: 'Customer',
            threadId: result.insertedId.toString(), // Same as above or use a placeholder
          },
        ],
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      };

      // Insert the structured object into the "ChannelManager" collection
      await db.collection('ChannelManager').insertOne(channelManagerData);

      // Send notification to the staff
      await notifyTeam(`New inquiry created for ${inquiryData.name}. Check it out here: https://channel.oravew.com/inquiries`);

      // Respond with success
      res.status(201).json({ message: 'Inquiry saved successfully', id: result.insertedId });
    } catch (error) {
      console.error('Error saving inquiry:', error);
      res.status(500).json({ error: 'Failed to save inquiry: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
