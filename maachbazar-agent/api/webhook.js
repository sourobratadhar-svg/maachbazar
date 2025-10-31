// Improved Vercel serverless webhook handler
const crypto = require('crypto');
const { validateConfig } = require('../config/validator');
const MessageHandler = require('../services/messageHandler');
const { sendMessage, markAsRead } = require('../services/whatsappService');
const { checkRateLimit } = require('../utils/rateLimiter');

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'maachbazar-secret123';
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;

const messageHandler = new MessageHandler();

function verifySignature(req) {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature || !APP_SECRET) return false;

    const expected = 'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(JSON.stringify(req.body)).digest('hex');
    try {
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch (e) {
        return false;
    }
}

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Hub-Signature-256');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Validate env (log but don't crash in serverless)
    validateConfig();

    // Webhook verification
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified');
            return res.status(200).send(challenge);
        }
        return res.status(403).send('Forbidden');
    }

    if (req.method === 'POST') {
        // Signature check in production
        if (process.env.NODE_ENV === 'production' && !verifySignature(req)) {
            console.error('Invalid signature');
            return res.status(401).send('Unauthorized');
        }

        const body = req.body;
        console.log('Incoming webhook:', JSON.stringify(body || {}, null, 2));

        try {
            if (!body || !body.entry) return res.status(200).send('EVENT_RECEIVED');

            for (const entry of body.entry) {
                const changes = entry.changes || [];
                for (const change of changes) {
                    const value = change.value || {};
                    const messages = value.messages || [];

                    for (const message of messages) {
                        const from = message.from;

                        // rate limit per phone number
                        const allowed = await checkRateLimit(from || 'global');
                        if (!allowed) {
                            console.warn('Rate limit exceeded for', from);
                            continue;
                        }

                        // mark as read (best effort)
                        if (message.id) await markAsRead(message.id);

                        // process
                        try {
                            const response = await messageHandler.processMessage(message);
                            if (response) await sendMessage(from, response);
                        } catch (procErr) {
                            console.error('Error processing message', procErr);
                            await sendMessage(from, { text: { body: 'Sorry, an error occurred. Please try again later.' } });
                        }
                    }
                }
            }

            return res.status(200).send('EVENT_RECEIVED');
        } catch (err) {
            console.error('Webhook handler error', err);
            return res.status(500).send('Internal Server Error');
        }
    }

    return res.status(405).send('Method Not Allowed');
};
