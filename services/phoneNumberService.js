// services/phoneNumberService.js
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Helper function to format and validate a US phone number in E.164 format
export function formatPhoneNumberToE164(phoneNumber) {
    // Parse the phone number and ensure it's a US number
    const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, 'US');

    if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
        // Return the phone number in E.164 format
        return parsedPhoneNumber.format('E.164');
    } else {
        throw new Error("Invalid US phone number provided.");
    }
}
