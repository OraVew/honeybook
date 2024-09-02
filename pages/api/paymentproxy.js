// pages/api/proxy.js
export default async function handler(req, res) {
    try {
        const response = await fetch('https://hooks.zapier.com/hooks/catch/17285769/2t80ip2/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            throw new Error('Failed to send data to Zapier');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error in proxy:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
