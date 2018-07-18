// Helper functions for authentication/authorisation
"use strict";

const request = require('request');

const response = require('./ReponseHelpers');

// Verifies the ReCAPTCHA key
exports.verifyReCAPTCHA = (req, res, next) => {
  const secretKey = process.env.G_RECAPTCHA_SECRET; // The secret key of the app
  // Verification URL for the verification request
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

  request(verificationUrl, (error, verResponse, body) => { // Send verification request
    body = JSON.parse(body);
    if (error || body.success !== null && !body.success) { // Verification unsucessful
      if (error) {
        response.error(`Could not verify reCAPTCHA: ${error}`);
      }
      // REVIEW: helper should not render response
      return res.render("pages/message", { title: "Contact", message: "Turing test failed. Please try again." });
    }
    next(); // Verification sucessful
  });
};
