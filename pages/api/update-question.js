import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const client = await clientPromise;
      const db = client.db("BookOraVew");

      const { inquiryId, ...updatedInquiry } = req.body;

      // Log the inquiryId and data being received
      console.log('Received inquiryId:', inquiryId);
      console.log('Received updatedInquiry data:', updatedInquiry);

      if (!inquiryId) {
        return res.status(400).json({ error: 'Inquiry ID is required' });
      }

      // Ensure inquiryId is converted to ObjectId
      const objectId = new ObjectId(inquiryId);

      // Remove fields that should not be updated (e.g., _id)
      delete updatedInquiry._id;

      // Log the inquiry update operation before executing it
      console.log('Updating inquiry with ID:', objectId);
      console.log('Updated data to be applied:', updatedInquiry);

      // Perform the update operation in MongoDB
      const result = await db.collection("Inquiry").updateOne(
        { _id: objectId },
        { $set: updatedInquiry }
      );

      // Check if the update was successful
      if (result.matchedCount === 0) {
        console.error('Inquiry not found for update');
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      // Send the updated inquiry data to Zapier
      const zapResponse = await fetch('https://hooks.zapier.com/hooks/catch/17285769/21dwlxi/', {
        method: 'POST',
        body: JSON.stringify(updatedInquiry),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!zapResponse.ok) {
        console.error('Zapier webhook failed:', zapResponse.statusText);
        return res.status(500).json({ error: 'Failed to trigger Zapier webhook' });
      }

      // Log successful response from Zapier
      console.log('Zapier response:', await zapResponse.json());

      // Respond with success
      return res.status(200).json({
        message: 'Inquiry updated successfully',
        updatedInquiry,
      });
    } catch (error) {
      console.error('Error updating inquiry:', error.message);
      return res.status(500).json({ error: 'Failed to update inquiry: ' + error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
