// api/webhook.js - Improved WhatsApp Webhook Handler
const axios = require('axios');
const crypto = require('crypto');

// ==================== CONFIGURATION ====================
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;
const API_VERSION = 'v18.0';

// Validate required environment variables
if (!WHATSAPP_TOKEN || !VERIFY_TOKEN || !PHONE_NUMBER_ID) {
    console.error('❌ Missing required environment variables');
}

// ==================== SECURITY ====================

/**
 * Verify webhook signature to ensure requests come from WhatsApp
 */
function verifySignature(req) {
    if (!APP_SECRET) {
        console.warn('⚠️ APP_SECRET not set - skipping signature verification');
        return true; // Allow in development
    }

    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        console.error('❌ No signature header found');
        return false;
    }

    try {
        const expectedSignature = 'sha256=' + crypto
            .createHmac('sha256', APP_SECRET)
            .update(JSON.stringify(req.body))
            .digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    } catch (error) {
        console.error('❌ Signature verification error:', error.message);
        return false;
    }
}

// ==================== MESSAGE PROCESSING ====================

/**
 * Process incoming message and determine response
 */
async function processMessage(message) {
    const messageType = message.type;
    
    switch (messageType) {
        case 'text':
            return handleTextMessage(message);
        case 'interactive':
            return handleInteractiveMessage(message);
        case 'button':
            return handleButtonReply(message);
        default:
            return {
                text: "Sorry, I can only process text messages and buttons at the moment."
            };
    }
}

/**
 * Handle text messages with intent recognition
 */
function handleTextMessage(message) {
    const text = message.text.body.toLowerCase().trim();
    
    // Greetings
    if (text.match(/^(hi|hello|hey|namaste|namaskar)/i)) {
        return getWelcomeMessage();
    }
    
    // Order intent
    if (text.match(/(order|buy|purchase|get|want)/i)) {
        return getProductCatalog();
    }
    
    // Track order
    if (text.match(/(status|track|where|order|delivery)/i)) {
        return getOrderTrackingMessage();
    }
    
    // Help
    if (text.match(/(help|support|assist|info)/i)) {
        return getHelpMenu();
    }
    
    // Location/Address
    if (text.match(/(location|address|delivery area|pincode)/i)) {
        return getLocationMessage();
    }
    
    // Pricing
    if (text.match(/(price|cost|rate|how much)/i)) {
        return getProductCatalog();
    }
    
    // Default fallback
    return getHelpMenu();
}

/**
 * Handle interactive button/list replies
 */
function handleInteractiveMessage(message) {
    const interactive = message.interactive;
    const responseId = interactive.button_reply?.id || interactive.list_reply?.id;
    
    switch (responseId) {
        case 'view_catalog':
            return getProductCatalog();
        case 'track_order':
            return getOrderTrackingMessage();
        case 'contact_support':
            return getSupportMessage();
        default:
            return getHelpMenu();
    }
}

/**
 * Handle button replies
 */
function handleButtonReply(message) {
    return handleInteractiveMessage(message);
}

// ==================== RESPONSE TEMPLATES ====================

function getWelcomeMessage() {
    return {
        type: 'interactive',
        interactive: {
            type: 'button',
            body: {
                text: '🐟 *Welcome to MaachBazar!*\n\n' +
                      'Fresh fish & poultry delivered to your doorstep in Faridabad.\n\n' +
                      '✅ Premium Quality\n' +
                      '✅ Same-Day Delivery\n' +
                      '✅ Best Prices\n\n' +
                      'What would you like to do?'
            },
            action: {
                buttons: [
                    {
                        type: 'reply',
                        reply: {
                            id: 'view_catalog',
                            title: '🛒 View Products'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: 'track_order',
                            title: '📦 Track Order'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: 'contact_support',
                            title: '💬 Support'
                        }
                    }
                ]
            }
        }
    };
}

function getProductCatalog() {
    return {
        type: 'interactive',
        interactive: {
            type: 'list',
            header: {
                type: 'text',
                text: '🐟 Fresh Selection'
            },
            body: {
                text: 'Choose from our fresh fish and poultry:\n\n' +
                      '✨ All items cleaned and cut\n' +
                      '🚚 Free delivery above ₹500'
            },
            footer: {
                text: 'Select a category'
            },
            action: {
                button: 'View Products',
                sections: [
                    {
                        title: '🐟 Fresh Fish',
                        rows: [
                            {
                                id: 'fish_rohu',
                                title: 'Rohu (রুই)',
                                description: '₹350/kg - Bengali favorite'
                            },
                            {
                                id: 'fish_katla',
                                title: 'Katla (কাতলা)',
                                description: '₹300/kg - Versatile fish'
                            },
                            {
                                id: 'fish_hilsa',
                                title: 'Hilsa (ইলিশ)',
                                description: '₹1200/kg - Premium quality'
                            },
                            {
                                id: 'fish_pomfret',
                                title: 'Pomfret',
                                description: '₹650/kg - White pomfret'
                            }
                        ]
                    },
                    {
                        title: '🍗 Fresh Chicken',
                        rows: [
                            {
                                id: 'chicken_curry',
                                title: 'Curry Cut',
                                description: '₹180/kg - 10-12 pieces'
                            },
                            {
                                id: 'chicken_whole',
                                title: 'Whole Chicken',
                                description: '₹160/kg - Farm fresh'
                            },
                            {
                                id: 'chicken_boneless',
                                title: 'Boneless',
                                description: '₹280/kg - Breast/thigh'
                            }
                        ]
                    },
                    {
                        title: '🦐 Seafood',
                        rows: [
                            {
                                id: 'prawns_medium',
                                title: 'Prawns (Medium)',
                                description: '₹450/kg - Fresh prawns'
                            },
                            {
                                id: 'crab',
                                title: 'Crab',
                                description: '₹600/kg - Live crabs'
                            }
                        ]
                    }
                ]
            }
        }
    };
}

function getOrderTrackingMessage() {
    return {
        text: '📦 *Track Your Order*\n\n' +
              'To check your order status:\n\n' +
              '1️⃣ Reply with your order number\n' +
              '   (Example: ORD12345)\n\n' +
              '2️⃣ Or visit: https://maachbazar.in/track\n\n' +
              '3️⃣ Call us: 📞 1800-123-FISH (3474)\n\n' +
              '_Recent order will be shown automatically_'
    };
}

function getHelpMenu() {
    return {
        text: '📱 *MaachBazar Help*\n\n' +
              '🛒 *ORDER*\n' +
              'Type "order" or "menu" to browse products\n\n' +
              '📦 *TRACK*\n' +
              'Type "status" or send order number\n\n' +
              '📍 *DELIVERY AREAS*\n' +
              'Type "location" to check coverage\n\n' +
              '💰 *PAYMENT*\n' +
              'Cash on Delivery, UPI, Cards accepted\n\n' +
              '⏰ *TIMINGS*\n' +
              '8 AM - 8 PM, 7 days a week\n\n' +
              '💬 *SUPPORT*\n' +
              '📞 1800-123-FISH (3474)\n' +
              '📧 help@maachbazar.in\n\n' +
              '_What would you like to do?_'
    };
}

function getLocationMessage() {
    return {
        text: '📍 *Delivery Areas*\n\n' +
              'We deliver across Faridabad:\n\n' +
              '✅ Sector 1-89\n' +
              '✅ NIT Area\n' +
              '✅ Old Faridabad\n' +
              '✅ Ballabgarh\n' +
              '✅ Greater Faridabad\n\n' +
              '🚚 *Delivery Charges:*\n' +
              '• FREE above ₹500\n' +
              '• ₹30 below ₹500\n\n' +
              '⏰ *Delivery Time:*\n' +
              '• Morning: 8 AM - 12 PM\n' +
              '• Evening: 4 PM - 8 PM\n\n' +
              'Send your pincode to confirm!'
    };
}

function getSupportMessage() {
    return {
        text: '💬 *Customer Support*\n\n' +
              '📞 *Call Us:*\n' +
              '1800-123-FISH (3474)\n' +
              'Monday-Sunday: 8 AM - 8 PM\n\n' +
              '📧 *Email:*\n' +
              'support@maachbazar.in\n' +
              'help@maachbazar.in\n\n' +
              '💬 *WhatsApp:*\n' +
              'You\'re already here! Just type your query.\n\n' +
              '🌐 *Website:*\n' +
              'www.maachbazar.in\n\n' +
              '_How can we help you today?_'
    };
}

// ==================== WHATSAPP API ====================

/**
 * Send message via WhatsApp Business API
 */
async function sendWhatsAppMessage(to, message) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.error('❌ Missing WhatsApp credentials');
        throw new Error('WhatsApp credentials not configured');
    }

    try {
        const response = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to,
                ...message
            },
            {
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        console.log(`✅ Message sent to ${to}:`, response.data.messages?.[0]?.id);
        return response.data;

    } catch (error) {
        console.error(`❌ Failed to send message to ${to}:`, 
            error.response?.data || error.message);
        throw error;
    }
}

/**
 * Mark message as read
 */
async function markAsRead(messageId) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        return;
    }

    try {
        await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                status: 'read',
                message_id: messageId
            },
            {
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`✅ Message ${messageId} marked as read`);
    } catch (error) {
        console.warn(`⚠️ Failed to mark message as read:`, error.message);
    }
}

// ==================== MAIN HANDLER ====================

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Hub-Signature-256');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ========== WEBHOOK VERIFICATION (GET) ==========
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        console.log('🔍 Webhook verification request:', { mode, token: token?.substring(0, 10) + '...' });

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✅ Webhook verified successfully!');
            return res.status(200).send(challenge);
        }

        console.log('❌ Webhook verification failed - token mismatch');
        return res.status(403).send('Forbidden');
    }

    // ========== HANDLE INCOMING MESSAGES (POST) ==========
    if (req.method === 'POST') {
        // Verify signature in production
        if (process.env.NODE_ENV === 'production') {
            if (!verifySignature(req)) {
                console.error('❌ Invalid webhook signature');
                return res.status(401).send('Unauthorized');
            }
        }

        const body = req.body;

        // Quick response to WhatsApp
        res.status(200).send('EVENT_RECEIVED');

        // Process webhook asynchronously
        try {
            console.log('📨 Webhook received:', JSON.stringify(body, null, 2));

            // Verify it's a WhatsApp webhook
            if (body.object !== 'whatsapp_business_account') {
                console.log('ℹ️ Non-WhatsApp webhook ignored');
                return;
            }

            // Extract message data
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const messages = value?.messages;

            // Handle status updates (no messages)
            if (!messages || messages.length === 0) {
                console.log('ℹ️ Status update or non-message event');
                return;
            }

            // Process each message
            for (const message of messages) {
                const from = message.from;
                const messageId = message.id;

                console.log(`💬 Processing message from ${from}:`, message.type);

                try {
                    // Mark message as read
                    await markAsRead(messageId);

                    // Process message and get response
                    const response = await processMessage(message);

                    // Send response
                    await sendWhatsAppMessage(from, response);

                    console.log(`✅ Successfully processed message ${messageId}`);

                } catch (msgError) {
                    console.error(`❌ Error processing message ${messageId}:`, msgError);

                    // Send error message to user
                    try {
                        await sendWhatsAppMessage(from, {
                            text: '😔 Sorry, I encountered an error. Please try again or call us at 1800-123-FISH (3474).'
                        });
                    } catch (sendError) {
                        console.error('❌ Failed to send error message:', sendError);
                    }
                }
            }

        } catch (error) {
            console.error('❌ Webhook processing error:', error);
            // Don't send error response - we already sent 200
        }

        return;
    }

    // Method not allowed
    return res.status(405).send('Method Not Allowed');
};
