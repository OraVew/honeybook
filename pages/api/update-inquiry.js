// /api/update-inquiry.js
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { notifyTeam } from '../../services/twilioService';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      console.log('Received data:', req.body);

      const client = await clientPromise;
      const db = client.db('BookOraVew');

      const { inquiryId, webhookUrl, selectedOffer, ...updatedInquiry } = req.body;

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

      console.log('Updating inquiry with ID:', inquiryId);

      // Update the inquiry in the "Inquiry"
      const result = await db.collection('Inquiry').updateOne(
        { _id: objectId },
        { $set: { ...updatedInquiry, selectedOffer } }
      );

      if (result.matchedCount === 0) {
        console.error('Inquiry not found:', inquiryId);
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      console.log('Inquiry updated in MongoDB:', updatedInquiry);

      // Construct the guestMessage
      const offerDetails = selectedOffer
        ? `Offer: ${selectedOffer.name} for $${selectedOffer.totalPrice} with ${selectedOffer.descriptionItems}  `
        : 'No offer selected';

      const newMessage = {
        timeSent: new Date(),
        guestMessage: `Hi! ${updatedInquiry.name} here. I need help with ${updatedInquiry.helpNeeded}. I have been looking for ${updatedInquiry.hoursNeeded} hours for my event since ${updatedInquiry.lookingFrom} ago. I plan to make a booking ${updatedInquiry.planningToBook} from now. I am an ${updatedInquiry.customerProfile} interest customer. And I want your ${offerDetails} all included in the package.`,
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

      // Send notification to the staff
      await notifyTeam(`${updatedInquiry.name} submitted more information. Check it out here: https://channel.oravew.com/inquiries`);

      // Respond with success
      res.status(200).json({
        message: 'Inquiry updated successfully',
        updatedInquiry,
      });
    } catch (error) {
      console.error('Error updating inquiry:', error);
      res.status(500).json({ error: 'Failed to update inquiry: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
