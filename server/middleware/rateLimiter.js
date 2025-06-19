const rateLimit = require("express-rate-limit");

const submissionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // max 10 submissions per minute
  message: {
    error: "⏱️ Too many submissions. Please wait a minute before trying again."
  }
});

module.exports = submissionLimiter;
