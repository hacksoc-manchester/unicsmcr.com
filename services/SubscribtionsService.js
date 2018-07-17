"use strict";

const dbHelpers = require('../helpers/DbHelpers');

exports.createSubscriber = (database, subscriber) => {
  return dbHelpers.createSubscriber(database, subscriber).then(data => {
    if (data.err) {
      return { err: true, message: data.message };
    }
    // TODO: send greeting email
    return { err: false, message: "Subscription created successfully!" };
  });
};

exports.removeSubscriber = (database, subscriptionId) => {
  return dbHelpers.removeSubscriber(database, subscriptionId).then(() => {
    return { err: false, message: "Subscription removed successfully!" };
  });
};

exports.subscribersList = (database) => {
  return dbHelpers.getSubscribers(database).then(list => list.map(s => s.dataValues));
};

exports.confirmSubscription = async (database, { firstName, lastName, email, subscriptionId }) => {
  // TODO: write out confirmation to external file
  const confirmation = await dbHelpers.confirmSubscriptionRequest(database, {
    subscriptionId,
    subscriberEmail: email
  });

  if (confirmation.err) {
    console.log(confirmation.err);
    return { err: true, message: "Could not confirm subscription request!" };
  }
  const newSubscriber = await dbHelpers.createSubscriber(database, {
    firstName,
    lastName,
    email,
    subscriptionId
  });

  //TODO: send greeting email
  return { err: false, message: "Subscription confirmed successfully!" };
};
