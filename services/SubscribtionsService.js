"use strict";

const fs = require('fs');

const emailService = require('./EmailService');
const dbHelpers = require('../helpers/DbHelpers');

exports.createSubscriber = async (database, subscriber, sendGreetingEmail = true) => { // REVIEW: refactor to use await instead of then
  return dbHelpers.createSubscriber(database, subscriber).then(data => {
    if (data.err) {
      return { err: true, message: data.message };
    }
    // TODO: send greeting email
    if (sendGreetingEmail) {
      
    }
    return { err: false, message: "Subscription created successfully!" };
  });
  try {
    const response = dbHelpers.createSubscriber(database, subscriber);

  } catch (err) {
    
  }
};

exports.removeSubscriber = (database, subscriptionId) => { // REVIEW: refactor to use await instead of then
  return dbHelpers.removeSubscriber(database, subscriptionId).then(() => {
    return { err: false, message: "Subscription removed successfully!" };
  });
};

exports.subscribersList = (database) => { // REVIEW: refactor to use await instead of then
  return dbHelpers.getSubscribers(database).then(list => list.map(s => s.dataValues));
};

exports.confirmSubscription = async (database, { firstName, lastName, email, subscriptionId }) => {
  fs.appendFile('./logs/GDPRConfirmations.csv', `\n${firstName},${lastName},${email}`, err => {
    if (err) {
      console.log("ERROR: Could not write confirmation to backup file!");
      console.log(err);
    }
  });

  const confirmation = await dbHelpers.confirmSubscriptionRequest(database, {
    subscriptionId,
    subscriberEmail: email
  });

  if (confirmation.err) {
    console.log(confirmation.err);
    return { err: true, message: "Could not confirm subscription request!" };
  }
  const response = await dbHelpers.createSubscriber(database, { // REVIEW: refactor to use the createSubscriber method in SubscriptionsService
    firstName,
    lastName,
    email,
    subscriptionId
  });

  if (response.err) {
    console.log(response.message);
    return { err: true, message: "Could not create new subscription!" };
  }
  emailService.sendGreetingEmail({
    recipient: {
      firstName,
      lastName,
      email,
      subscriptionId
    }
  });
  return { err: false, message: "Subscription confirmed successfully!" };
};
