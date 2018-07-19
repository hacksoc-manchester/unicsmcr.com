"use strict";

const emailService = require('./EmailService');
const loggingService = require('./LoggingService');
const dbHelpers = require('../helpers/DbHelpers');
const response = require('../helpers/ReponseHelpers');

exports.createSubscriber = async (database, subscriber, sendGreetingEmail = true) => {
  try {
    const createdSubscriber = await dbHelpers.createSubscriber(database, subscriber);

    if (createdSubscriber.err) {
      return response.error(createdSubscriber.message);
    }

    if (sendGreetingEmail) {
      emailService.sendGreetingEmail({ recipient: { ...createdSubscriber.data } });
    }
    return response.success(`Subscription for ${createdSubscriber.email} created successfully!`, createdSubscriber.data);
  } catch (err) {
    return response.error(`Could not create subscription for ${subscriber.email}: ${err}`);
  }
};

exports.removeSubscriber = async (database, subscriptionId) => {
  try {
    const result = await dbHelpers.removeSubscriber(database, subscriptionId);

    if (result.err) {
      return response.error(`Could not remove subscription ${subscriptionId}`);
    }
    return response.success(`Subnscription ${subscriptionId} removed successfully!`);
  } catch (err) {
    return response.error(`Could not remove subscription ${subscriptionId}: ${err}`);
  }
};

exports.subscribersList = (database) => {
  return dbHelpers.getSubscribers(database).then(list => list.map(s => s.dataValues));
};

exports.confirmSubscription = async (database, { firstName, lastName, email, subscriptionId }) => {

  loggingService.logMessage(loggingService.subscriptionConfirmation, `\n${firstName},${lastName},${email},${new Date().toUTCString()}`);

  const confirmation = await dbHelpers.confirmSubscriptionRequest(database, {
    subscriptionId,
    subscriberEmail: email
  });

  if (confirmation.err) {
    return response.error(`Could not confirm subscription request for ${email}`);
  }
  const createdSubscriber = await exports.createSubscriber(database, { firstName, lastName, email, subscriptionId }, false);

  if (createdSubscriber.err) {
    return response.error(`Could not confirm subscription request for ${email}`);
  }
  return response.success(`Subscription for ${email} confirmed successfully!`, createdSubscriber.data);
};
