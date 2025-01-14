//services/twilioService.js

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Send an SMS
export async function sendSMS(to, message) {
    try {
        const response = await client.messages.create({
            body: message,
            from: fromPhoneNumber,
            to,
        });
        console.log(`Message sent to ${to}:`, response.sid);
        return response;
    } catch (error) {
        console.error(`Failed to send SMS to ${to}:`, error.message);
        throw error;
    }
}

// Notify Team Members
export async function notifyTeam(message) {
    // Use only the staff phone number you specified
    const staffPhoneNumber = '+13128153713'; 
    await sendSMS(staffPhoneNumber, message);
}

export async function notifyAdmin(message) {
    // Use only the staff phone number you specified
    const adminPhoneNumber = '+13125449613'; 
    await sendSMS(adminPhoneNumber, message);
}

