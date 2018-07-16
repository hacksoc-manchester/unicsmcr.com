"use strict";

const miscHelpers = require('../helpers/MiscHelpers');

exports.createSubscriber = (database, { firstName, lastName, email, subscriptionId }) => {
  if (!subscriptionId) {
    subscriptionId = miscHelpers.MakeRandomString(process.env.SUBSCRIPTION_ID_LENGTH);
  }
  return database.Subscriber.findOne({
    where: {
      email
    }
  }).then(subscriber => {
    if (subscriber) {
      console.log(`Subscriber ${email} already exists`);
      return { err: true, message: `${email} is already taken` };
    }
    return database.Subscriber.create({
      firstName,
      lastName,
      email,
      subscriptionId
    }).then(newSubscriber => {
      if (!newSubscriber) {
        console.log(`Could not create subscriber ${email}: unkown error`);
        return { err: true, message: `Could not create subscriber ${email}` };
      }
      console.log(`Subscriber ${email} created`);
      return { err: false };
    });
  });
};

exports.removeSubscriber = (database, subscriptionId) => {
  return database.Subscriber.destroy({
    where: {
      subscriptionId
    }
  });
};

exports.getSubscribers = (database) => {
  return database.Subscriber.findAll({
    attributes: ['firstName', 'lastName', 'email', 'subscriptionId']
  }).then(data => data);
};

exports.confirmSubscriptionRequest = (database, { subscriptionId, subscriberEmail }) => {
  return database.SubscriptionRequest.findOne({
    where: {
      subscriptionId,
      subscriberEmail
    }
  }).then(request => {
    if (!request) {
      return { err: true, message: "SubscriptionRequest not found!" };
    }
    request.destroy();
    return { err: false, message: "SubscriptionRequest confirmed successfully!" };
  });
};
