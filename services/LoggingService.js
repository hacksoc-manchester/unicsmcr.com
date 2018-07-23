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

exports.emailRequestIssued = {
  type: "Email request issued",
  logFile: "./logs/emailRequests.csv"
};

exports.emailSent = {
  type: "Email sent",
  logFile: "./logs/sentEmails.csv"
};

exports.emailRequestFailed = {
  type: "Sending email failed",
  logFile: "./logs/failedEmails.csv"
};

// Logs a message to the file specified in logType.logFile
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
