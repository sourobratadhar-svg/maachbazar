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
                            { id: 'fish_rohu', title: 'Rohu', description: '₹350/kg' },
                            { id: 'fish_katla', title: 'Katla', description: '₹300/kg' }
                        ] },
                        { title: 'Fresh Chicken', rows: [
                            { id: 'chicken_curry', title: 'Curry Cut', description: '₹180/kg' }
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
