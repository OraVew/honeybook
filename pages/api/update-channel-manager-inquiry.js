import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const client = await clientPromise;
      const db = client.db('BookOraVew');

      // Extract the inquiryId and new message from the request body
      const { inquiryId, newMessage } = req.body; // No need for JSON.parse

      // Ensure inquiryId and newMessage are provided
      if (!inquiryId || !newMessage) {
        return res.status(400).json({ error: 'Inquiry ID and new message are required' });
      }

      // Log the inquiryId and newMessage
      console.log('Adding message to inquiry with ID:', inquiryId);
      console.log('New message:', newMessage);

      // Update the existing inquiry in the ChannelManager collection
      const result = await db.collection('ChannelManager').updateOne(
        { inquiryId },
        {
          $push: { messages: newMessage }, // Append the new message to the messages array
          $set: { lastUpdatedAt: new Date() }, // Update the lastUpdatedAt timestamp
        }
      );

      if (result.matchedCount === 0) {
        console.error('Inquiry not found:', inquiryId);
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      console.log('Message added successfully to inquiry:', inquiryId);

      return res.status(200).json({ message: 'Message added successfully' });
    } catch (error) {
      console.error('Error adding message to inquiry:', error);
      return res.status(500).json({ error: 'Failed to add message: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
