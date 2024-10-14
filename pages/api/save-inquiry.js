
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db("BookOraVew");

      const inquiryData = req.body;

      // Insert the inquiry data into the "Inquiry" collection in MongoDB
      const result = await db.collection("Inquiry").insertOne(inquiryData);

      // Send the data to Zapier webhook
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/17285769/26vc7il/';
      await fetch(zapierWebhookUrl, {
        method: 'POST',
        body: JSON.stringify(inquiryData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Respond with success
      res.status(201).json({ message: 'Inquiry saved successfully', id: result.insertedId });
    } catch (error) {
      console.error('Error saving inquiry:', error);
      res.status(500).json({ error: 'Failed to save inquiry: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
