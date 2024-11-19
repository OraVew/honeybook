import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      // Log the incoming data
      console.log('Received data:', req.body);

      // Establish a connection to MongoDB
      const client = await clientPromise;
      const db = client.db("BookOraVew");

      // Extract the _id, inquiryId, and webhookUrl from the request body
      const { _id, inquiryId, webhookUrl, ...updatedInquiry } = req.body;

      // Log the received webhookUrl to check if it's being passed correctly
      console.log('Received Webhook URL:', webhookUrl);

      // Ensure webhookUrl is defined, if not, return an error
      if (!webhookUrl) {
        console.error('Webhook URL is missing');
        return res.status(400).json({ error: 'Webhook URL is required' });
      }

      // Ensure _id is present
      if (!_id) {
        return res.status(400).json({ error: '_id is required' });
      }

      // Convert _id to ObjectId
      let objectId;
      try {
        objectId = new ObjectId(_id); // Use the correct _id from the Inquiry collection
      } catch (e) {
        console.error('Invalid _id:', _id);
        return res.status(400).json({ error: 'Invalid _id' });
      }

      // Log the inquiry ID and data before updating
      console.log('Updating inquiry with ID:', _id);
      console.log('Updated inquiry data:', updatedInquiry);

      // Update the inquiry in MongoDB (without the webhookUrl)
      const result = await db.collection("Inquiry").updateOne(
        { _id: objectId }, // Use the validated ObjectId
        { $set: updatedInquiry } // Only store fields other than webhookUrl
      );

      if (result.matchedCount === 0) {
        console.error('Inquiry not found:', _id);
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      console.log('Inquiry updated in MongoDB:', updatedInquiry);

      // Send the updated data to the specified Zapier webhook (including webhookUrl)
      const zapResponse = await fetch(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(updatedInquiry), // Send full data to Zapier
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the Zapier response is successful
      if (!zapResponse.ok) {
        console.error('Zapier webhook failed:', zapResponse.statusText);
        return res.status(500).json({ error: 'Failed to trigger Zapier webhook' });
      }

      console.log('Zapier webhook triggered successfully.');

      // Respond with success message
      return res.status(200).json({
        message: 'Inquiry updated successfully',
        updatedInquiry,
      });

    } catch (error) {
      console.error('Error updating inquiry:', error);
      return res.status(500).json({ error: 'Failed to update inquiry: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
