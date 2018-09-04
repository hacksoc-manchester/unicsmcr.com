// Miscellaneous helper functions
"use strict";

const crypto = require('crypto');

// Makes a random string of given length
exports.MakeRandomString = (length) => {
  return Math.random().toString(36).slice(2, length) + Math.random().toString(36).slice(2, length);
};

exports.hashPassword = (password) => {
  return crypto.createHash("md5").update(password).digest("base64");
};

exports.invalidParamsResponse = {
  type: "message",
  title: "Error",
  message: "Invalid parameters provided.<br>If you believe this shouldn't have happened please contact us at contact@hacksoc.com"
};
