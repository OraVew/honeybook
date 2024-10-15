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

      // Extract the inquiryId and updated inquiry data from the request body
      const { inquiryId, webhookUrl, ...updatedInquiry } = req.body;  // Destructure and exclude webhookUrl

      // Ensure inquiryId is present
      if (!inquiryId) {
        return res.status(400).json({ error: 'Inquiry ID is required' });
      }

      // Validate if inquiryId is a valid ObjectId
      let objectId;
      try {
        objectId = new ObjectId(inquiryId);
      } catch (e) {
        console.error('Invalid inquiryId:', inquiryId);
        return res.status(400).json({ error: 'Invalid Inquiry ID' });
      }

      // Log the inquiry ID and data before updating
      console.log('Updating inquiry with ID:', inquiryId);
      console.log('Updated inquiry data:', updatedInquiry);

      // Update the inquiry in MongoDB (without the webhookUrl)
      const result = await db.collection("Inquiry").updateOne(
        { _id: objectId }, // Use the validated ObjectId
        { $set: updatedInquiry } // Only store fields other than webhookUrl
      );

      if (result.matchedCount === 0) {
        console.error('Inquiry not found:', inquiryId);
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
