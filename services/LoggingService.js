"use strict";

const fs = require('fs');

// Log types
exports.error = {
  type: "Error",
  logFile: "./logs/errorLog.txt"
};
exports.subscriptionConfirmation = {
  type: "Subscription confirmation",
  logFile: "./logs/subscriptionConfirmationLog.csv"
};

exports.logMessage = (logType, message) => {
  if (!process.env.LOGGING_ENABLED) {
    return;
  }
  try {
    fs.appendFileSync(logType.logFile, message);
  } catch (error) {
    console.error(`Could not log ${logType.type} log: ${message}`);
  }
};
