// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3000;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN; // Your secret verify token
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// 1. Webhook Verification Endpoint
// WhatsApp sends a GET request to this URL to verify your webhook is legitimate.
// Webhook verification endpoint
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return res.status(200).send(challenge); 
        } else {
            return res.sendStatus(403);
        }
    } else {
        return res.sendStatus(400); // Always respond to avoid hanging
    }
});
// 2. Main Webhook Endpoint for Incoming Messages
// This is where you receive all user messages and events.
app.post('/webhook', (req, res) => {
    const body = req.body;
    
    // Check if it's a WhatsApp message notification
    if (body.object && body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        const from = message.from; // User's WhatsApp number

        // TODO: Add your agent's logic here!
        console.log(`Message from ${from}:`, JSON.stringify(message, null, 2));

        // Example: Send a simple reply
        sendMessage(from, "Hello from Maachbazar! How can I help you today?");
    }

    res.sendStatus(200); // Respond immediately to WhatsApp
});

// Function to send a message using the Cloud API
async function sendMessage(to, text) {
    try {
        await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            messaging_product: 'whatsapp',
            to: to,
            text: { body: text }
        }, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Message sent to ${to}`);
    } catch (error) {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
    }
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});