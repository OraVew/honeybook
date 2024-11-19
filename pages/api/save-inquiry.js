// /api/save-inquiry.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db("BookOraVew");

      const inquiryData = req.body;

      // Format eventDateAndTime to a human-readable format
      const eventDate = new Date(inquiryData.eventDate);
      const formattedEventDate = eventDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      // Insert the inquiry data into the "Inquiry" collection
      const result = await db.collection("Inquiry").insertOne(inquiryData);

      // Create a structured object for the "ChannelManager" collection
      const channelManagerData = {
        inquiryId: result.insertedId.toString(), // Unique identifier
        customerName: inquiryData.name,
        replyTo: inquiryData.phone, // Using phone as 'replyTo'
        eventDateAndTime: formattedEventDate, // Human-readable format
        attendeeCount: parseInt(inquiryData.guestCount, 10),
        payout: inquiryData.budget,
        addOns: '', // Fill this in as needed
        platform: 'Book.OraVew.com', // Fill this in as needed
        threadId: result.insertedId.toString(), // Fill this in as needed or generate one if necessary
        inquiryStatus: 'open', // Default status
        messages: [
          {
            timeSent: new Date(),
            guestMessage: `Initial inquiry: ${inquiryData.eventType}, ${inquiryData.budget}, ${inquiryData.bestTimeToContact}`,
            sender: 'Customer',
            threadId: result.insertedId.toString(), // Same as above or use a placeholder
          },
        ],
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      };

      // Insert the structured object into the "ChannelManager" collection
      await db.collection("ChannelManager").insertOne(channelManagerData);

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
