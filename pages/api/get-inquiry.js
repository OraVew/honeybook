import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Inquiry ID is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("BookOraVew");

    // Fetch the inquiry data by ID
    const inquiry = await db.collection("Inquiry").findOne({ _id: new ObjectId(id) });

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.status(200).json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry: ' + error.message });
  }
}
