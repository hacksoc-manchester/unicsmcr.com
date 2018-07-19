// Helper functions for communication with the database
"use strict";

const miscHelpers = require('../helpers/MiscHelpers');
const response = require('../helpers/ReponseHelpers');

// Creates a new subscriber
exports.createSubscriber = async (database, { firstName, lastName, email, subscriptionId }) => {
  try {
    if (!subscriptionId) { // If no subscriptionId is provided, generate a subscriptionId
      subscriptionId = miscHelpers.MakeRandomString(process.env.SUBSCRIPTION_ID_LENGTH);
    }
    // Check if a subscriber with given email exists
    const existingSubscriber = await database.Subscriber.findOne({
      where: {
        email
      }
    });

    if (existingSubscriber) { // If the given email is already taken, a new subscriber cannot be created
      throw new Error(`${email} is already taken`);
    }

    // Creating a new subscriber
    const newSubscriber = await database.Subscriber.create({
      firstName,
      lastName,
      email,
      subscriptionId
    });

    // Subscriber created, returning response
    return response.success(`Subscriber ${email} created succesfully!`, newSubscriber.dataValues);
  } catch (err) {
    return response.error(`Could not create subscriber: ${err.message}`);
  }
};

// Removes an existing subscriber
exports.removeSubscriber = async (database, { email, subscriptionId }) => {
  try {
    // Remove the subscriber from the database
    await database.Subscriber.destroy({
      where: {
        email,
        subscriptionId
      }
    });

    // Subscriber removed, returning response
    return response.success(`Subscriber ${email} removed succesfully!`);
  } catch (err) {
    return response.error(`Could not remove subscriber: ${err.message}`);
  }
};

// Gets a list of all subscribers (admin use only)
exports.getSubscribers = async (database) => {
  try {
    // Get the list of all subscribers
    const subscribers = await database.Subscriber.findAll({
      attributes: ['firstName', 'lastName', 'email', 'subscriptionId']
    });

    // List of all subscribers received, returning response
    return response.success(`Subscriber list fetched successfully!`, subscribers.map(s => s.dataValues));
  } catch (err) {
    return response.error(`Could not list subscribers: ${err}`, err);
  }
};

// Creates a new subscription request
exports.createSubscriptionRequest = async (database, { subscriberEmail, subscriptionId }) => {
  try {
    // Create subscription request
    const subRequest = await database.SubscriptionRequest.create({
      subscriberEmail,
      subscriptionId
    });

    // Subscription request created, returning response
    return response.success(`Subscriber request fo ${subscriberEmail} created succesfully!`, subRequest.dataValues);
  } catch (err) {
    return response.error(`Could not create subscription request: ${err.message}`);
  }
};

// Confirms a subscription request
exports.confirmSubscriptionRequest = async (database, { subscriptionId, subscriberEmail }) => {
  try {
    // Find the subscription request in question
    const subRequest = await database.SubscriptionRequest.findOne({
      where: {
        subscriptionId,
        subscriberEmail
      }
    });

    if (!subRequest) { // Specified subscription request does not exist
      throw new Error(`Subscription request for ${subscriberEmail} not found!`);
    }
    // Subscrition request has been confirmed and can now be removed from the database
    subRequest.destroy();
    // Subscription request confirmed, returning response
    return response.success(`Subscription request for ${subscriberEmail} confirmed!`);
  } catch (err) {
    return response.error(`Could not confirm subscription request: ${err.message}`);
  }
};
