// config/validator.js
function validateConfig() {
    const required = ['WHATSAPP_TOKEN', 'VERIFY_TOKEN', 'PHONE_NUMBER_ID', 'WHATSAPP_APP_SECRET'];
    const missing = required.filter(k => !process.env[k]);

    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Optional warnings
    if (!process.env.NODE_ENV) {
        console.warn('⚠️ NODE_ENV not set. Set NODE_ENV=production in production environments.');
    }

    if (!process.env.SERVICE_NAME) {
        console.warn('⚠️ SERVICE_NAME not set. You may set SERVICE_NAME to identify this service in health checks.');
    }

    return true;
}

module.exports = { validateConfig };
// config/validator.js
function validateConfig() {
    const required = [
        'WHATSAPP_TOKEN',
        'VERIFY_TOKEN',
        'PHONE_NUMBER_ID',
        'WHATSAPP_APP_SECRET'
    ];

    const missing = required.filter(k => !process.env[k]);
    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
        // Don't throw in serverless cold start; return false so caller can decide
        return false;
    }
    return true;
}

module.exports = { validateConfig };
