"use strict";

const miscHelpers = require('../helpers/MiscHelpers');
const response = require('../helpers/ReponseHelper');

exports.createSubscriber = async (database, { firstName, lastName, email, subscriptionId }) => {
  try {
    if (!subscriptionId) {
      subscriptionId = miscHelpers.MakeRandomString(process.env.SUBSCRIPTION_ID_LENGTH);
    }
    const existingSubscriber = await database.Subscriber.findOne({
      where: {
        email
      }
    });

    if (existingSubscriber) {
      throw new Error(`${email} is already taken`);
    }
    const newSubscriber = await database.Subscriber.create({
      firstName,
      lastName,
      email,
      subscriptionId
    });

    return response.success(`Subscriber ${email} created succesfully!`, newSubscriber.dataValues);
  } catch (err) {
    return response.error(`Could not create subscriber: ${err.message}`);
  }
};

exports.removeSubscriber = async (database, { email, subscriptionId }) => {
  try {
    await database.Subscriber.destroy({
      where: {
        email,
        subscriptionId
      }
    });
    return response.success(`Subscriber ${email} removed succesfully!`);
  } catch (err) {
    return response.error(`Could not remove subscriber: ${err.message}`);
  }
};

exports.getSubscribers = async (database) => {
  try {
    const subscribers = await database.Subscriber.findAll({
      attributes: ['firstName', 'lastName', 'email', 'subscriptionId']
    });

    return response.success(`Subscriber list fetched successfully!`, subscribers.map(s => s.dataValues));
  } catch (err) {
    return response.error(`Could not list subscribers: ${err.message}`);
  }
};

exports.createSubscriptionRequest = async (database, { subscriberEmail, subscriptionId }) => {
  try {
    const subRequest = await database.SubscriptionRequest.create({
      subscriberEmail,
      subscriptionId
    });

    return response.success(`Subscriber request fo ${subscriberEmail} created succesfully!`, subRequest.dataValues);
  } catch (err) {
    return response.error(`Could not create subscription request: ${err.message}`);
  }
};

exports.confirmSubscriptionRequest = async (database, { subscriptionId, subscriberEmail }) => {
  try {
    const subRequest = await database.SubscriptionRequest.findOne({
      where: {
        subscriptionId,
        subscriberEmail
      }
    });

    if (!subRequest) {
      throw new Error(`Subscription request for ${subscriberEmail} not found!`);
    }
    subRequest.destroy();
    return response.success(`Subscription request for ${subscriberEmail} confirmed!`);
  } catch (err) {
    return response.error(`Could not confirm subscription request: ${err.message}`);
  }
};
