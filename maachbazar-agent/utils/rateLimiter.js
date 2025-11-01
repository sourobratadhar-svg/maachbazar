// utils/rateLimiter.js
const { RateLimiterMemory } = require('rate-limiter-flexible');

// 10 messages per 60 seconds per phone number
const limiter = new RateLimiterMemory({ points: 10, duration: 60 });

async function checkRateLimit(phoneNumber) {
    try {
        await limiter.consume(phoneNumber);
        return true; // allowed
    } catch (rejRes) {
        // Rate limited
        return false;
    }
}

module.exports = { checkRateLimit };
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
