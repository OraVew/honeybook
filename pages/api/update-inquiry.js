// /api/update-inquiry.js
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

      // Extract the inquiryId and webhookUrl from the request body
      const { inquiryId, webhookUrl, ...updatedInquiry } = req.body;

      // Log the received webhookUrl to check if it's being passed correctly
      console.log('Received Webhook URL:', webhookUrl);

      // Ensure webhookUrl is defined, if not, return an error
      if (!webhookUrl) {
        console.error('Webhook URL is missing');
        return res.status(400).json({ error: 'Webhook URL is required' });
      }

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

      // Update the inquiry in the "Inquiry" collection (without the webhookUrl)
      const result = await db.collection("Inquiry").updateOne(
        { _id: objectId }, // Use the validated ObjectId
        { $set: updatedInquiry } // Only store fields other than webhookUrl
      );

      if (result.matchedCount === 0) {
        console.error('Inquiry not found:', inquiryId);
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      console.log('Inquiry updated in MongoDB:', updatedInquiry);

      // Prepare the new message to append
      const newMessage = {
        timeSent: new Date(),
        guestMessage: `Updated Inquiry Details:
        - Name: ${updatedInquiry.name}
        - Email: ${updatedInquiry.email}
        - Phone: ${updatedInquiry.phone}
        - Event Date: ${updatedInquiry.eventDate}
        - Event Time (CST): ${updatedInquiry.eventTimeCST || 'N/A'}
        - Start Time: ${updatedInquiry.startTime ? new Date(updatedInquiry.startTime).toLocaleString() : 'N/A'}
        - Event Duration: ${updatedInquiry.eventDuration || 'N/A'} hours
        - Venue Search Duration: ${updatedInquiry.venueSearchDuration || 'N/A'}
        - Secure Venue Urgency: ${updatedInquiry.secureVenueUrgency || 'N/A'}
        - Help Needed: ${updatedInquiry.helpNeeded || 'N/A'}
        - Guest Count: ${updatedInquiry.guestCount}
        - Budget: $${updatedInquiry.budget}
        - How Did You Find Us: ${updatedInquiry.howDidYouFindUs || 'N/A'}
        - Event Type: ${updatedInquiry.eventType || 'N/A'}
        - Inquiry Date: ${updatedInquiry.inquiryDate ? new Date(updatedInquiry.inquiryDate).toLocaleString() : 'N/A'}
        - Hours Needed: ${updatedInquiry.hoursNeeded}
        - Looking From: ${updatedInquiry.lookingFrom || 'N/A'}
        - Planning to Book: ${updatedInquiry.planningToBook || 'N/A'}
        - Customer Profile: ${updatedInquiry.customerProfile || 'N/A'}
        - Availability Status: ${updatedInquiry.isAvailable ? 'Available' : 'Not Available'}`,
        sender: 'Customer',
        threadId: inquiryId,
      };

      // Update the "ChannelManager" collection to append the new message
      const channelManagerUpdateResult = await db.collection("ChannelManager").updateOne(
        { inquiryId: inquiryId }, // Use the inquiryId to find the correct document
        { $push: { messages: newMessage }, $set: { lastUpdatedAt: new Date() } } // Append the new message and update lastUpdatedAt
      );

      if (channelManagerUpdateResult.matchedCount === 0) {
        console.error('ChannelManager entry not found:', inquiryId);
        return res.status(404).json({ error: 'ChannelManager entry not found' });
      }

      console.log('ChannelManager entry updated successfully with new message.');

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
