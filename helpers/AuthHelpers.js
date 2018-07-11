"use strict";

const request = require('request');

exports.verifyReCAPTCHA = (req, res, next) => {
  const secretKey = process.env.G_RECAPTCHA_SECRET;
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

  request(verificationUrl, function (error, response, body) {
    body = JSON.parse(body);
    if (body.success !== undefined && !body.success) { // Verification unsucessful
      return res.send({ error: true, message: "Failed captcha verification" });
    }
    next(req, res); // Verification sucessful
  });
};
