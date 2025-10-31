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
