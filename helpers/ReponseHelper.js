"use strict";

exports.success = (message, data, messageToLog) => {
  if (messageToLog) {
    console.log(messageToLog);
  }
  return { err: false, message, data };
};

exports.error = (message, data) => {
  console.log(message);
  return { err: true, message, data };
};
