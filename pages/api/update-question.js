import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { notifyTeam } from '../../services/twilioService';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const client = await clientPromise;
      const db = client.db("BookOraVew");

      const { inquiryId, question, ...updatedInquiry } = req.body;

      console.log('Received inquiryId:', inquiryId);
      console.log('Received question:', question);
      console.log('Received updatedInquiry data:', updatedInquiry);

      if (!inquiryId) {
        return res.status(400).json({ error: 'Inquiry ID is required' });
      }

      let objectId;
      try {
        objectId = new ObjectId(inquiryId);
      } catch (e) {
        console.error('Invalid inquiryId:', inquiryId);
        return res.status(400).json({ error: 'Invalid Inquiry ID' });
      }

      // Remove fields that should not be updated (e.g., _id)
      delete updatedInquiry._id;

      console.log('Updating inquiry with ID:', objectId);
      console.log('Updated data to be applied:', updatedInquiry);

      // Update the inquiry in MongoDB
      const result = await db.collection("Inquiry").updateOne(
        { _id: objectId },
        { $set: updatedInquiry }
      );

      if (result.matchedCount === 0) {
        console.error('Inquiry not found for update');
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      console.log('Inquiry updated in MongoDB:', updatedInquiry);

      // Construct the guestMessage
      const newMessage = {
        timeSent: new Date(),
        guestMessage: `Hi! ${updatedInquiry.name} here. I have a question: "${question}".`,
        sender: 'Customer',
        threadId: inquiryId,
      };

      // Update the "ChannelManager" collection
      const channelManagerUpdateResult = await db.collection('ChannelManager').updateOne(
        { inquiryId: inquiryId },
        {
          $push: { messages: newMessage },
          $set: { lastUpdatedAt: new Date() },
        }
      );

      if (channelManagerUpdateResult.matchedCount === 0) {
        console.error('ChannelManager entry not found:', inquiryId);
        return res.status(404).json({ error: 'ChannelManager entry not found' });
      }

      console.log('ChannelManager entry updated successfully.');

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

      console.log('Zapier response:', await zapResponse.json());

      // Notify the team
      await notifyTeam(`${updatedInquiry.name} asked a question: "${question}". Check it out here: https://channel.oravew.com/inquiries`);

      // Respond with success
      return res.status(200).json({
        message: 'Question updated successfully',
        updatedInquiry,
      });
    } catch (error) {
      console.error('Error updating question:', error.message);
      return res.status(500).json({ error: 'Failed to update question: ' + error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
