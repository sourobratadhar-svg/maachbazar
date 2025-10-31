const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 60
});

async function checkRateLimit(key) {
    try {
        await rateLimiter.consume(key);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = { checkRateLimit };
