// Root endpoint for Vercel
module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
        message: 'MaachBazar WhatsApp Agent is running!',
        webhook: '/api/webhook',
        status: 'active',
        timestamp: new Date().toISOString()
    });
};
