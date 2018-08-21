// Helper functions for communication with the database
"use strict";

const miscHelpers = require('../helpers/MiscHelpers');

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
    return newSubscriber.dataValues;
  } catch (err) {
    throw new Error(`Could not create subscriber: ${err}`);
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
    return { err: false };
  } catch (err) {
    throw new Error(`Could not remove subscriber: ${err}`);
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
    return subscribers.map(s => s.dataValues);
  } catch (err) {
    throw new Error(`Could not list subscribers: ${err}`);
  }
};

// Creates a new subscription request
exports.createSubscriptionRequest = async (database, { subscriberEmail }) => {
  try {
    // Check if a subscription/subscription request already exist for the given email
    // if it does, use the existing subscriptionId
    const existingSubscriptionRequest = await database.SubscriptionRequest.findOne({
      where: {
        subscriberEmail
      }
    });

    if (existingSubscriptionRequest) {
      // Subsription request already exists, returning
      return existingSubscriptionRequest.dataValues;
    }
    const existingSubscriber = await database.Subscriber.findOne({
      where: {
        email: subscriberEmail
      }
    });

    if (existingSubscriber) {
      throw new Error(`User ${subscriberEmail} already exists!`);
    }
    // No form of preexisting subscription found, creating new subscription request
    const subscriptionId = miscHelpers.MakeRandomString(process.env.SUBSCRIPTION_ID_LENGTH);

    // Create subscription request
    const subRequest = await database.SubscriptionRequest.create({
      subscriberEmail,
      subscriptionId
    });

    // Subscription request created, returning response
    return subRequest.dataValues;
  } catch (err) {
    throw new Error(`Could not create subscription request: ${err}`);
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
    return { err: false };
  } catch (err) {
    throw new Error(`Could not confirm subscription request: ${err}`);
  }
};
