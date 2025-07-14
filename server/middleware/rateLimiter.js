const rateLimit = require("express-rate-limit");

const submissionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: {
    error: "⏱️ Too many submissions. Please wait a minute before trying again."
  }
});

module.exports = submissionLimiter;
