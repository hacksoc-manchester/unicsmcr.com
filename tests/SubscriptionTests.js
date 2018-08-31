// Tests to check if user-accessible subscription methods work properly
"use strict";

const chai = require("chai");
const expect = require('chai').expect;

const dbHelpers = require('../helpers/DbHelpers');

module.exports = (mocha, app) => {
  const dbConnection = require('../db/Sequelize');
  const database = dbConnection.init();

  const testSubscriber = {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@email.com"
  };

  mocha.describe("Subscription tests:", () => {
    const { firstName, lastName, email } = testSubscriber;

    mocha.it("Should create a new Subscriber", async () => {
      // Removing test subscriber if it was created in previous tests
      const oldSubscriber = await dbHelpers.findSubscriberByEmail(database, email);

      if (oldSubscriber) {
        await dbHelpers.removeSubscriber(database, { email, subscriptionId: oldSubscriber.subscriptionId });
      }

      try {
        await chai.request(app)
          .post('/subscription/create')
          .type('urlencoded')
          .send({
            _method: 'post',
            firstName,
            lastName,
            email
          });
        const newSubscriber = await dbHelpers.findSubscriberByEmail(database, email);

        expect(subscribersAreEqual(testSubscriber, newSubscriber)).to.be.true;
        testSubscriber.subscriptionId = newSubscriber.subscriptionId;
      } catch (err) {
        expect(err).to.be.null;
      }
    });

    mocha.it("Should remove Subscriber with GET request", async () => {
      try {
        await chai.request(app)
          .get('/subscription/remove')
          .query({ email: testSubscriber.email, subscriptionId: testSubscriber.subscriptionId });
        const foundSubscriber = await dbHelpers.findSubscriberByEmail(database, email);

        expect(foundSubscriber).to.be.null;
      } catch (err) {
        expect(err).to.be.null;
      }
    });

    mocha.it("Should remove Subscriber with DELETE request", async () => {
      try {
        await dbHelpers.createSubscriber(database, testSubscriber);
        await chai.request(app)
          .del("/subscription/remove")
          .type('urlencoded')
          .send({
            _method: "delete",
            email: testSubscriber.email,
            subscriptionId: testSubscriber.subscriptionId
          });
        const foundSubscriber = await dbHelpers.findSubscriberByEmail(database, email);

        expect(foundSubscriber).to.be.null;
      } catch (err) {
        expect(err).to.be.null;
      }
    });
  });
};

const subscribersAreEqual = (subscriberA, subscriberB) => {
  return subscriberA.email == subscriberB.email &&
    subscriberA.firstName == subscriberB.firstName &&
    subscriberA.lastName == subscriberB.lastName;
};
