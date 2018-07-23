"use strict";

const emailService = require('./EmailService');
const loggingService = require('./LoggingService');
const dbHelpers = require('../helpers/DbHelpers');
const response = require('../helpers/ReponseHelpers');

// Createss a new subscriber
exports.createSubscriber = async (database, subscriber, sendGreetingEmail = true) => {
  try {
    // Create subscriber in database
    const createdSubscriber = await dbHelpers.createSubscriber(database, subscriber);

    if (createdSubscriber.err) {
      return response.error(createdSubscriber.message);
    }

    if (sendGreetingEmail) { // Optionally send a greeting email
      emailService.sendGreetingEmail({ recipient: { ...createdSubscriber.data } });
    }
    return response.success(`Subscription for ${createdSubscriber.email} created successfully!`, createdSubscriber.data);
  } catch (err) {
    return response.error(`Could not create subscription for ${subscriber.email}: ${err}`);
  }
};

// Removes a subscriber
exports.removeSubscriber = async (database, subscriptionId) => {
  try {
    // Remove the subscriber from the database
    const result = await dbHelpers.removeSubscriber(database, subscriptionId);

    if (result.err) {
      return response.error(`Could not remove subscription ${subscriptionId}`);
    }
    return response.success(`Subnscription ${subscriptionId} removed successfully!`);
  } catch (err) {
    return response.error(`Could not remove subscription ${subscriptionId}: ${err}`);
  }
};

// Returns a list of all subscribers (admin use only)
exports.subscribersList = async (database) => {
  const result = await dbHelpers.getSubscribers(database);

  if (result.err) {
    return; // REVIEW: refactor make ResponseHelper be used only in services
  }
  return response.success(`Subscriber list fetched successfully!`, result.data);
};

// Confirms a subscription request
exports.confirmSubscription = async (database, { firstName, lastName, email, subscriptionId }) => {
  // Backing up the confirmation in an external file
  loggingService.logMessage(loggingService.subscriptionConfirmation, `${firstName},${lastName},${email},${new Date().toUTCString()}\n`);

  // Confirming the subscription request
  const confirmation = await dbHelpers.confirmSubscriptionRequest(database, {
    subscriptionId,
    subscriberEmail: email
  });

  if (confirmation.err) {
    return response.error(`Could not confirm subscription request for ${email}`);
  }
  // Creating a new subscriber
  const createdSubscriber = await exports.createSubscriber(database, { firstName, lastName, email, subscriptionId }, false);

  if (createdSubscriber.err) {
    return response.error(`Could not confirm subscription request for ${email}`);
  }
  return response.success(`Subscription for ${email} confirmed successfully!`, createdSubscriber.data);
};
