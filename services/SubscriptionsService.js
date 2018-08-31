"use strict";

const emailService = require('./EmailService');
const loggingService = require('./LoggingService');
const dbHelpers = require('../helpers/DbHelpers');

// Createss a new subscriber
exports.createSubscriber = async (database, subscriber, sendGreetingEmail = false) => {
  // Create subscriber in database
  const createdSubscriber = await dbHelpers.createSubscriber(database, subscriber);

  if (sendGreetingEmail) { // Optionally send a greeting email
    emailService.sendGreetingEmail({ recipient: { ...createdSubscriber } });
  }
  return createdSubscriber;
};

// Removes a subscriber
exports.removeSubscriber = async (database, subscriptionId) => {
  // Remove the subscriber from the database
  const result = await dbHelpers.removeSubscriber(database, subscriptionId);

  return result;
};

// Returns a list of all subscribers (admin use only)
exports.subscribersList = async (database) => {
  const list = await dbHelpers.getSubscribers(database);

  return list;
};

// Confirms a subscription request
exports.confirmSubscription = async (database, { firstName, lastName, email, subscriptionId }) => {
  // Backing up the confirmation in an external file
  loggingService.logMessage(loggingService.subscriptionConfirmation, `${firstName},${lastName},${email},${new Date().toUTCString()}\n`);

  // Confirming the subscription request
  await dbHelpers.confirmSubscriptionRequest(database, {
    subscriptionId,
    subscriberEmail: email
  });

  // Creating a new subscriber
  const createdSubscriber = await exports.createSubscriber(database, { firstName, lastName, email, subscriptionId }, false);

  return createdSubscriber;
};
