// pages/api/dynamicproxy.js
export default async function handler(req, res) {
    const response = await fetch('https://hooks.zapier.com/hooks/catch/17285769/21h7vza/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
  
    const data = await response.json();
    res.status(200).json(data);
  }
  