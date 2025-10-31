const axios = require('axios');

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

async function sendMessage(to, message) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.warn('WhatsApp credentials missing, skipping sendMessage');
        return null;
    }

    const payload = Object.assign({ messaging_product: 'whatsapp', to }, message);

    const resp = await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        payload,
        { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } }
    );

    return resp.data;
}

async function markAsRead(messageId) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) return null;

    try {
        await axios.post(
            `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
            { messaging_product: 'whatsapp', status: 'read', message_id: messageId },
            { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } }
        );
    } catch (e) {
        console.warn('markAsRead failed', e.message);
    }
}

module.exports = { sendMessage, markAsRead };
