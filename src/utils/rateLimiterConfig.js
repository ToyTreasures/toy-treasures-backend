const { default: rateLimit } = require("express-rate-limit");

rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

module.exports = rateLimit;
