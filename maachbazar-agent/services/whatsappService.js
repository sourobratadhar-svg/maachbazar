// services/whatsappService.js
const axios = require('axios');

class WhatsAppService {
    constructor({ token, phoneNumberId, apiVersion = 'v18.0' } = {}) {
        this.token = token || process.env.WHATSAPP_TOKEN;
        this.phoneNumberId = phoneNumberId || process.env.PHONE_NUMBER_ID;
        this.apiVersion = apiVersion;

        this.client = axios.create({
            baseURL: `https://graph.facebook.com/${this.apiVersion}`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token ? `Bearer ${this.token}` : undefined
            }
        });
    }

    async sendMessage(to, message) {
        if (!this.token || !this.phoneNumberId) {
            const err = new Error('WhatsApp credentials not configured');
            console.error(err.message);
            throw err;
        }

        try {
            const payload = Object.assign({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to
            }, message);

            const res = await this.client.post(`/${this.phoneNumberId}/messages`, payload);
            return res.data;
        } catch (error) {
            console.error('Failed to send WhatsApp message:', error.response?.data || error.message);
            throw error;
        }
    }

    async sendTextMessage(to, text) {
        return this.sendMessage(to, { text: { body: text } });
    }

    async sendInteractiveMessage(to, interactive) {
        return this.sendMessage(to, { interactive });
    }

    async markAsRead(messageId) {
        if (!this.token || !this.phoneNumberId) return;
        try {
            await this.client.post(`/${this.phoneNumberId}/messages`, {
                messaging_product: 'whatsapp',
                status: 'read',
                message_id: messageId
            });
        } catch (error) {
            console.warn('Failed to mark message as read:', error.message);
        }
    }

    async sendTypingIndicator(to) {
        // WhatsApp Cloud API doesn't provide a standard typing indicator endpoint for Cloud API
        // Placeholder for future if supported or for a custom integration
        try {
            // no-op, but keep API consistent
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = WhatsAppService;
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
