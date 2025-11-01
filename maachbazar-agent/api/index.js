// Root / health endpoint for Vercel
const pkg = require('../../package.json');

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const envChecks = {
        WHATSAPP_TOKEN: !!process.env.WHATSAPP_TOKEN,
        VERIFY_TOKEN: !!process.env.VERIFY_TOKEN,
        PHONE_NUMBER_ID: !!process.env.PHONE_NUMBER_ID,
        WHATSAPP_APP_SECRET: !!process.env.WHATSAPP_APP_SECRET
    };

    const lastWebhook = process.MAACHBAZAR_LAST_WEBHOOK || null;

    const uptimeSec = Math.floor(process.uptime());

    res.status(200).json({
        service: process.env.SERVICE_NAME || pkg.name || 'maachbazar-whatsapp-agent',
        version: pkg.version || '0.0.0',
        api: '/api/webhook',
        env: envChecks,
        lastWebhookReceivedAt: lastWebhook,
        uptimeSeconds: uptimeSec,
        timestamp: new Date().toISOString()
    });
};
