import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, likes } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Inquiry ID is required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db("BookOraVew");

      // Update the likes for the specific inquiry
      const result = await db.collection("Inquiry").updateOne(
        { _id: new ObjectId(id) },
        { $set: { likes: likes } }
      );

      if (result.modifiedCount === 1) {
        return res.status(200).json({ message: 'Likes updated successfully' });
      } else {
        return res.status(404).json({ message: 'Inquiry not found' });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      res.status(500).json({ error: 'Failed to update likes: ' + error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
