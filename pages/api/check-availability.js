import { google } from 'googleapis';
import moment from 'moment-timezone';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { startTime, endTime } = req.body;

  // Validate input data
  if (!startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required parameters: startTime or endTime' });
  }

  try {
    // Initialize Google Calendar API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Convert startTime and endTime to the correct timezone (America/Chicago)
    const eventStart = moment.tz(startTime, 'America/Chicago').toISOString();
    const eventEnd = moment.tz(endTime, 'America/Chicago').toISOString();

    // Make a call to the Google Calendar API freebusy query
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: eventStart,
        timeMax: eventEnd,
        timeZone: 'America/Chicago',
        items: [{ id: 'c_f64009fdd73360de1ae776964d11f0462b2a173ac1ddf90381d397df396fe5fd@group.calendar.google.com' }],
      },
    });

    // Extract the busy times from the response
    const busyTimes = response.data.calendars['c_f64009fdd73360de1ae776964d11f0462b2a173ac1ddf90381d397df396fe5fd@group.calendar.google.com'].busy;

    // Check if the event overlaps with any busy times
    const isAvailable = !busyTimes.some(busyTime => {
      const busyStart = moment(busyTime.start);
      const busyEnd = moment(busyTime.end);
      return (
        (moment(eventStart).isBetween(busyStart, busyEnd)) ||
        (moment(eventEnd).isBetween(busyStart, busyEnd)) ||
        (busyStart.isBetween(eventStart, eventEnd)) ||
        (busyEnd.isBetween(eventStart, eventEnd))
      );
    });

    res.status(200).json({ isAvailable });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
