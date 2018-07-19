// Helper functions used to universalize the transfer of data between functions
"use strict";

const loggingService = require('../services/LoggingService');

// Returns a success object and optionally logs a message
exports.success = (message, data, messageToLog) => {
  if (messageToLog) { // If there is a message to log, log it
    console.log(messageToLog);
  }
  return { err: false, message, data };
};

// Returns an error object and logs the message
exports.error = (message, data) => {
  console.error(message);
  loggingService.logMessage(loggingService.error, `${new Date().toUTCString()}\n${message}`);
  return { err: true, message, data };
};
