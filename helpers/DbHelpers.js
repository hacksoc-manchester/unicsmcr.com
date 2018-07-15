"use strict";

exports.createSubscriber = (database, { firstName, lastName, email }) => {
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
      subscriptionId: Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15)
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
