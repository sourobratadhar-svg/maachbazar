// Vercel serverless function for webhook
const axios = require('axios');

module.exports = async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "maachbazar-secret123"; // fallback for dev
    const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

    // ✅ Webhook verification (GET)
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        console.log('🔎 Webhook verification request:', { mode, token, challenge });

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✅ Webhook Verified Successfully!');
            res.status(200).send(challenge); // MUST send challenge as plain text
        } else {
            console.log('❌ Webhook Verification Failed — Token mismatch');
            res.status(403).send('Forbidden');
        }
        return;
    }

    // ✅ Handle incoming messages (POST)
    if (req.method === 'POST') {
        const body = req.body;
        console.log("📩 Incoming webhook body:", JSON.stringify(body, null, 2));

        try {
            if (
                body.object &&
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0].value &&
                body.entry[0].changes[0].value.messages
            ) {
                const message = body.entry[0].changes[0].value.messages[0];
                const from = message.from;

                console.log(`💬 Message from ${from}:`, message);

                // Reply to the sender
                if (WHATSAPP_TOKEN && PHONE_NUMBER_ID) {
                    await axios.post(
                        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
                        {
                            messaging_product: 'whatsapp',
                            to: from,
                            text: { body: "Hello from Maachbazar! How can I help you today?" }
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    console.log(`✅ Message sent to ${from}`);
                } else {
                    console.warn("⚠️ Missing WhatsApp token or phone number ID — skipping reply");
                }
            }
        } catch (error) {
            console.error("❌ Error handling webhook POST:", error.response ? error.response.data : error.message);
        }

        res.status(200).send('EVENT_RECEIVED');
        return;
    }

    res.status(405).send('Method Not Allowed');
};
