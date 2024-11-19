import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db("BookOraVew");

      const channelManagerInquiry = req.body;

      // Insert the data into the "ChannelManager" collection in MongoDB
      const result = await db.collection("ChannelManager").insertOne(channelManagerInquiry);

      res.status(201).json({ message: 'ChannelManager inquiry saved successfully', id: result.insertedId });
    } catch (error) {
      console.error('Error saving ChannelManager inquiry:', error);
      res.status(500).json({ error: 'Failed to save ChannelManager inquiry: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
