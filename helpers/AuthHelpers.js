// Helper functions for authentication/authorisation
"use strict";

const request = require('request');

// Verifies the ReCAPTCHA key
exports.verifyReCAPTCHA = (req, res, next) => {
  const secretKey = process.env.G_RECAPTCHA_SECRET; // The secret key of the app
  // Verification URL for the verification request
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

  request(verificationUrl, (err, verResponse, body) => { // Send verification request
    body = JSON.parse(body);
    if (err || body.success !== null && !body.success) { // Verification unsucessful
      req.body.captchaMessage = "Error: Turing test failed. Please try again.";
    }
    next();
  });
};

exports.attachReCAPTCHAKey = (req, res, next) => {
  res.locals.recaptchaKey = process.env.G_RECAPTCHA_KEY;
  next();
};
