import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, comment } = req.body;

    if (!id || !comment) {
      return res.status(400).json({ error: 'Inquiry ID and comment are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db("BookOraVew");

      // Push the new comment to the comments array of the specified inquiry
      const result = await db.collection("Inquiry").updateOne(
        { _id: new ObjectId(id) },
        { $push: { comments: comment } }  // Append the new comment to the array
      );

      if (result.modifiedCount === 1) {
        return res.status(200).json({ message: 'Comment added successfully' });
      } else {
        return res.status(404).json({ message: 'Inquiry not found' });
      }
    } catch (error) {
      console.error('Error updating comments:', error);
      res.status(500).json({ error: 'Failed to update comments: ' + error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
