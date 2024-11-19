// /api/save-inquiry.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db("BookOraVew");

      const inquiryData = req.body;

      // Insert the inquiry data into the "ChannelManager" collection in MongoDB
      const result = await db.collection("ChannelManager").insertOne(inquiryData);

      // Respond with success (No Zapier call here, let /api/qualifyproxy handle it)
      res.status(201).json({ message: 'Inquiry saved successfully', id: result.insertedId });
    } catch (error) {
      console.error('Error saving inquiry:', error);
      res.status(500).json({ error: 'Failed to save inquiry: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
