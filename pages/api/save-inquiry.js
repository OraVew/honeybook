// /api/save-inquiry.js
// /pages/api/save-inquiry.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db("BookOraVew");
      const collection = db.collection("ChannelManager");

      // Extract the inquiry data from the request body
      const inquiryData = req.body;

      // Insert the inquiry data into the "ChannelManager" collection
      const result = await collection.insertOne(inquiryData);

      // Respond with the inserted ID
      res.status(201).json({ message: 'Inquiry saved successfully', id: result.insertedId });
    } catch (error) {
      console.error("Error saving inquiry to ChannelManager:", error);
      res.status(500).json({ error: "Failed to save inquiry: " + error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

