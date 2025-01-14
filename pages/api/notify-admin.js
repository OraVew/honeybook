import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const adminPhoneNumber = '+13125449613';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, phone } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Missing required fields: name or phone' });
    }

    try {
        const message = `Book.OraVew Paid Lead: Customer Name: ${name}, Phone: ${phone}`;
        const response = await client.messages.create({
            body: message,
            from: fromPhoneNumber,
            to: adminPhoneNumber,
        });

        console.log(`Message sent to admin: ${response.sid}`);
        return res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Error sending notification:', error.message);
        return res.status(500).json({ error: 'Failed to send notification' });
    }
}
