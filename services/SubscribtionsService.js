"use strict";

const dbHelpers = require('../helpers/DbHelpers');

exports.createSubscriber = (database, subscriber) => {
  return dbHelpers.createSubscriber(database, subscriber).then(data => {
    if (data.err) {
      return { err: true, message: data.message };
    }
    // TODO: send confirmation email
    return { err: false, message: "Subscription created successfully!" };
  });
};

exports.removeSubscriber = (database, subscriptionId) => {
  return dbHelpers.removeSubscriber(database, subscriptionId).then(() => {
    return { err: false, message: "Subscription removed successfully!" };
  });
};
