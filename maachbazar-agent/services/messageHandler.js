// services/messageHandler.js
// MessageHandler class to process incoming WhatsApp messages and produce responses
class MessageHandler {
    constructor() {
        // Simple product catalog embedded here for now
        this.catalog = {
            fish: [
                { id: 'fish_rohu', title: 'Rohu (রুই)', price: '₹320/kg' },
                { id: 'fish_katla', title: 'Katla (কাতলা)', price: '₹350/kg' },
                { id: 'fish_hilsa', title: 'Hilsa (ইলিশ)', price: '₹1200/kg' },
                { id: 'fish_pomfret', title: 'Pomfret', price: '₹650/kg' },
                { id: 'fish_bhetki', title: 'Bhetki (বেতকি)', price: '₹700/kg' }
            ],
            chicken: [
                { id: 'chicken_curry', title: 'Curry Cut', price: '₹280/kg' },
                { id: 'chicken_whole', title: 'Whole Chicken', price: '₹250/kg' },
                { id: 'chicken_boneless', title: 'Boneless', price: '₹280/kg' }
            ],
            seafood: [
                { id: 'prawns_medium', title: 'Prawns (Medium)', price: '₹450/kg' },
                { id: 'crab', title: 'Crab', price: '₹600/kg' }
            ]
        };
    }

    // Main entry point
    async processMessage(message) {
        const type = message.type || 'text';
        if (type === 'text') return this.handleTextMessage(message);
        if (type === 'interactive' || type === 'button') return this.handleInteractiveMessage(message);
        // fallback
        return this.getHelpMenu();
    }

    handleTextMessage(message) {
        const text = (message.text && message.text.body) ? message.text.body.toLowerCase().trim() : '';

        // Intent recognition
        if (!text) return this.getHelpMenu();

        if (text.match(/\b(hi|hello|hey|namaste|namaskar)\b/i)) return this.getWelcomeMessage();
        if (text.match(/\b(order|buy|purchase|get|want|menu)\b/i)) return this.getProductCatalog();
        if (text.match(/\b(status|track|where|order|delivery)\b/i)) return this.getOrderTracking();
        if (text.match(/\b(help|support|assist|info)\b/i)) return this.getHelpMenu();
        if (text.match(/\b(location|address|pincode|area)\b/i)) return this.getLocationMessage();
        if (text.match(/\b(price|cost|rate|how much)\b/i)) return this.getProductCatalog();

        // If user sent an order id like ORD12345
        if (text.match(/\bord\w*\d{3,}\b/i)) return this.getOrderTracking(text);

        // Default
        return this.getHelpMenu();
    }

    handleInteractiveMessage(message) {
        const interactive = message.interactive || {};
        const type = interactive.type;

        const buttonReplyId = interactive.button_reply?.id || interactive.list_reply?.id;
        if (buttonReplyId) {
            switch (buttonReplyId) {
                case 'view_catalog':
                    return this.getProductCatalog();
                case 'track_order':
                    return this.getOrderTracking();
                case 'contact_support':
                    return this.getHelpMenu();
                default:
                    // If the id matches a catalog item, return a short details text
                    return this.getProductDetailsById(buttonReplyId);
            }
        }

        if (type === 'button') return this.getHelpMenu();
        return this.getHelpMenu();
    }

    getProductDetailsById(id) {
        const all = [...this.catalog.fish, ...this.catalog.chicken, ...this.catalog.seafood];
        const found = all.find(i => i.id === id);
        if (!found) return this.getProductCatalog();
        return {
            text: `*${found.title}*\nPrice: ${found.price}\n\nTo order reply with:\nORDER ${found.id} <quantity>`
        };
    }

    getWelcomeMessage() {
        return {
            type: 'interactive',
            interactive: {
                type: 'button',
                body: { text: '🐟 Welcome to MaachBazar! Fresh fish & poultry delivered to your door. What would you like to do?' },
                action: {
                    buttons: [
                        { type: 'reply', reply: { id: 'view_catalog', title: '🛒 View Products' } },
                        { type: 'reply', reply: { id: 'track_order', title: '📦 Track Order' } },
                        { type: 'reply', reply: { id: 'contact_support', title: '💬 Support' } }
                    ]
                }
            }
        };
    }

    getProductCatalog() {
        // Build a WhatsApp list interactive message
        return {
            type: 'interactive',
            interactive: {
                type: 'list',
                header: { type: 'text', text: '🐟 MaachBazar Catalog' },
                body: { text: 'Choose from our fresh fish, poultry and seafood. Tap a product to see details.' },
                footer: { text: 'Free delivery above ₹500' },
                action: {
                    button: 'View Products',
                    sections: [
                        {
                            title: '🐟 Fresh Fish',
                            rows: this.catalog.fish.map(f => ({ id: f.id, title: f.title, description: f.price }))
                        },
                        {
                            title: '🍗 Fresh Chicken',
                            rows: this.catalog.chicken.map(c => ({ id: c.id, title: c.title, description: c.price }))
                        },
                        {
                            title: '🦐 Seafood',
                            rows: this.catalog.seafood.map(s => ({ id: s.id, title: s.title, description: s.price }))
                        }
                    ]
                }
            }
        };
    }

    getOrderTracking(orderId) {
        const idText = typeof orderId === 'string' ? orderId : '';
        return {
            text: `📦 *Track Your Order*\n\nReply with your order number (e.g. ORD12345) or visit https://maachbazar.in/track\n\n${idText ? `Looking up *${idText}*...` : ''}`
        };
    }

    getHelpMenu() {
        return {
            text: '📱 *MaachBazar Help*\n\n- Type "order" or "menu" to browse products\n- Type "status" or send order number to track\n- Type "location" to check delivery areas\n- Call 1800-123-FISH (3474) for urgent help'
        };
    }

    getLocationMessage() {
        return {
            text: '📍 We deliver across Faridabad (Sector 1-89, NIT, Old Faridabad, Ballabgarh). Send your pincode to confirm.'
        };
    }
}

module.exports = MessageHandler;
class MessageHandler {
    async processMessage(message) {
        const from = message.from;
        if (!message.type && message.text) message.type = 'text';

        switch (message.type) {
            case 'text':
                return this.handleTextMessage(message);
            case 'interactive':
                return this.handleInteractiveMessage(message);
            default:
                return { text: { body: "Sorry, I can only process text messages right now." } };
        }
    }

    async handleTextMessage(message) {
        const text = (message.text && message.text.body) ? message.text.body.toLowerCase() : '';

        if (text.includes('order') || text.includes('buy')) return this.showProductCatalog();
        if (text.includes('hi') || text.includes('hello')) return this.showWelcomeMessage();
        if (text.includes('help') || text.includes('support')) return this.showHelpMenu();
        if (text.includes('status')) return await this.showOrderStatus(message.from);

        return this.showHelpMenu();
    }

    handleInteractiveMessage(message) {
        // Minimal placeholder
        return { text: { body: 'Thanks for interacting — we will process your selection.' } };
    }

    showWelcomeMessage() {
        return {
            interactive: {
                type: 'button',
                body: { text: '🐟 Welcome to MaachBazar! How can I help you today?' },
                action: {
                    buttons: [
                        { type: 'reply', reply: { id: 'view_catalog', title: '🛒 View Products' } },
                        { type: 'reply', reply: { id: 'track_order', title: '📦 Track Order' } },
                        { type: 'reply', reply: { id: 'contact_support', title: '💬 Support' } }
                    ]
                }
            }
        };
    }

    showProductCatalog() {
        return {
            interactive: {
                type: 'list',
                header: { type: 'text', text: '🐟 Our Fresh Selection' },
                body: { text: 'Choose a category to browse:' },
                action: {
                    button: 'View Categories',
                    sections: [
                        { title: 'Fresh Fish', rows: [
                            { id: 'fish_rohu', title: 'Rohu', description: '₹320/kg' },
                            { id: 'fish_katla', title: 'Katla', description: '₹350/kg' }
                        ] },
                        { title: 'Fresh Chicken', rows: [
                            { id: 'chicken_curry', title: 'Curry Cut', description: '₹280/kg' }
                        ] }
                    ]
                }
            }
        };
    }

    showHelpMenu() {
        return { text: { body: `📱 MaachBazar Help Menu\n\nType *order* - Browse products\nType *status* - Track your order\nType *support* - Talk to us` } };
    }

    async showOrderStatus(phoneNumber) {
        // placeholder
        return { text: { body: `📦 Your latest order (sample):\nOrder #12345\nStatus: Out for Delivery` } };
    }
}

module.exports = MessageHandler;
