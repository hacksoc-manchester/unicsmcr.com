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
    mocha.it("Should remove Subscriber with GET request", async () => {
      try {
        const newSubscriber = await dbHelpers.createSubscriber(database, testSubscriber);

        await chai.request(app)
          .get('/subscription/remove')
          .query({ email: newSubscriber.email, subscriptionId: newSubscriber.subscriptionId });
        const foundSubscriber = await dbHelpers.findSubscriberByEmail(database, testSubscriber.email);

        expect(foundSubscriber).to.be.null;
      } catch (err) {
        expect(err).to.be.null;
      }
    });

    mocha.it("Should remove Subscriber with DELETE request", async () => {
      try {
        const newSubscriber = await dbHelpers.createSubscriber(database, testSubscriber);

        await chai.request(app)
          .del("/subscription/remove")
          .type('urlencoded')
          .send({
            _method: "delete",
            email: newSubscriber.email,
            subscriptionId: newSubscriber.subscriptionId
          });
        const foundSubscriber = await dbHelpers.findSubscriberByEmail(database, testSubscriber.email);

        expect(foundSubscriber).to.be.null;
      } catch (err) {
        expect(err).to.be.null;
      }
    });
  });
};