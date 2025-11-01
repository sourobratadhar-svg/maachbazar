// api/webhook.js - Improved WhatsApp Webhook Handler (wired to services)
const crypto = require('crypto');
const { validateConfig } = require('../config/validator');
const MessageHandler = require('../services/messageHandler');
const WhatsAppService = require('../services/whatsappService');
const { checkRateLimit } = require('../utils/rateLimiter');

// Validate environment on module load
try {
    validateConfig();
} catch (err) {
    // In serverless environments you may want to fail fast
    console.error('Environment validation failed:', err.message);
    // Do not throw to avoid crashing Vercel build step; handlers will still error on use.
}

const API_VERSION = 'v18.0';

const messageHandler = new MessageHandler();
const waService = new WhatsAppService({ apiVersion: API_VERSION });

function verifySignature(req) {
    const APP_SECRET = process.env.WHATSAPP_APP_SECRET;
    if (!APP_SECRET) {
        console.warn('⚠️ APP_SECRET not set - skipping signature verification');
        return true;
    }

    const signature = req.headers['x-hub-signature-256'];
    if (!signature) return false;

    try {
        const expected = 'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(JSON.stringify(req.body)).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch (e) {
        console.error('Signature verification error', e.message);
        return false;
    }
}

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Hub-Signature-256');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Webhook verification
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        console.log('🔍 Webhook verification request');
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            return res.status(200).send(challenge);
        }
        return res.status(403).send('Forbidden');
    }

    if (req.method === 'POST') {
        // optional signature verification in production
        if (process.env.NODE_ENV === 'production' && !verifySignature(req)) {
            console.error('❌ Invalid webhook signature');
            return res.status(401).send('Unauthorized');
        }

        // Quick 200 to acknowledge
        res.status(200).send('EVENT_RECEIVED');

        // Update last webhook timestamp for health checks
        try {
            process.MAACHBAZAR_LAST_WEBHOOK = new Date().toISOString();
        } catch (e) {
            // ignore
        }

        const body = req.body;
        try {
            if (body.object !== 'whatsapp_business_account') return;

            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const messages = value?.messages;

            if (!messages || messages.length === 0) return;

            for (const message of messages) {
                const from = message.from;
                const messageId = message.id;

                console.log(`� Received message ${messageId} from ${from}`);

                try {
                    // Mark read (best effort)
                    await waService.markAsRead(messageId);

                    // Rate limiting per phone number
                    const allowed = await checkRateLimit(from);
                    if (!allowed) {
                        await waService.sendTextMessage(from, '⚠️ You are sending messages too frequently. Please wait a moment.');
                        continue;
                    }

                    // Process message using MessageHandler
                    const response = await messageHandler.processMessage(message);

                    // Send response using WhatsApp service
                    if (response && response.type === 'interactive') {
                        await waService.sendInteractiveMessage(from, response.interactive);
                    } else if (response && response.text) {
                        await waService.sendTextMessage(from, response.text);
                    } else {
                        // default fallback - send as text if object
                        await waService.sendTextMessage(from, typeof response === 'string' ? response : JSON.stringify(response));
                    }

                    console.log(`✅ Processed message ${messageId}`);

                } catch (err) {
                    console.error('Error processing message:', err.message || err);
                    try {
                        await waService.sendTextMessage(from, '😔 Sorry, something went wrong. Please try again later.');
                    } catch (ignore) {}
                }
            }
        } catch (err) {
            console.error('Webhook processing error:', err.message || err);
        }

        return;
    }

    return res.status(405).send('Method Not Allowed');
};
