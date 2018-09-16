// Tests to check if user-accessible subscription methods (without reCAPTCHA) work properly
"use strict";

const chai = require("chai");
const expect = require('chai').expect;

const dbHelpers = require('../helpers/DbHelpers');

const HTTP_OK = 200;

module.exports = (mocha, app) => {
  const dbConnection = require('../db/Sequelize');
  const database = dbConnection.init();

  const testSubscriber = {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@email.com",
    agreeToPrivacyPolicy: true,
    teams: "test",
    reasonToJoin: "test"
  };

  mocha.describe("Subscription tests:", () => {
    mocha.it("Should confirm Subsription with old GET request", async () => {
      try {
        const newSubscriptionRequest = await dbHelpers.createSubscriptionRequest(database, { subscriberEmail: testSubscriber.email });

        await chai.request(app)
          .get('/subscription/confirm')
          .query({ ...testSubscriber, subscriptionId: newSubscriptionRequest.subscriptionId });
        const foundSubscriber = await dbHelpers.findSubscriberByEmail(database, testSubscriber.email);
        const foundSubscriptionRequest = (await database.query(`SELECT * FROM subscriptionrequests WHERE subscriberEmail='${testSubscriber.email}'`))[0];

        expect(foundSubscriber).to.be.not.null;
        expect(foundSubscriptionRequest).to.be.empty;
        await dbHelpers.removeSubscriber(database, foundSubscriber);
      } catch (err) {
        expect(err).to.be.null;
      }
    });

    mocha.it("Should confirm Subsription with new GET request", async () => {
      try {
        const newSubscriptionRequest = await dbHelpers.createSubscriptionRequest(database, { subscriberEmail: testSubscriber.email });

        await chai.request(app)
          .get('/signup/subscription/confirm')
          .query({ ...testSubscriber, subscriptionId: newSubscriptionRequest.subscriptionId });
        const foundSubscriber = await dbHelpers.findSubscriberByEmail(database, testSubscriber.email);
        const foundSubscriptionRequest = (await database.query(`SELECT * FROM subscriptionrequests WHERE subscriberEmail='${testSubscriber.email}'`))[0];

        expect(foundSubscriber).to.be.not.null;
        expect(foundSubscriptionRequest).to.be.empty;
        await dbHelpers.removeSubscriber(database, foundSubscriber);
      } catch (err) {
        expect(err).to.be.null;
      }
    });

    mocha.it("Should remove Subscriber with old GET request", async () => {
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

    mocha.it("Should remove Subscriber with new GET request", async () => {
      try {
        const newSubscriber = await dbHelpers.createSubscriber(database, testSubscriber);

        await chai.request(app)
          .get('/signup/subscription/remove')
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
          .del("/signup/subscription/remove")
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

    mocha.it("Should create a new Subscriber", async () => {
      const response = await chai.request(app)
        .post('/subscription/create')
        .send(testSubscriber);
      const foundSubscriber = await dbHelpers.findSubscriberByEmail(database, testSubscriber.email);

      expect(foundSubscriber).to.be.not.null;
      expect(response).to.have.status(HTTP_OK);
      expect(response.text).to.contain("Success");
      await dbHelpers.removeSubscriber(database, foundSubscriber);
    });

    mocha.it("Should create a new VolunteerApplication", async () => {
      const response = await chai.request(app)
        .post('/volunteer/application/create')
        .send(testSubscriber);
      const foundApplication = (await database.query(`SELECT * FROM volunteerapplications WHERE email ='${testSubscriber.email}'`))[0][0];

      expect(foundApplication).to.be.not.null;
      expect(response).to.have.status(HTTP_OK);
      expect(response.text).to.contain("Success");
      await database.query(`DELETE FROM volunteerapplications WHERE email='${testSubscriber.email}'`);
    });

    mocha.it("Should create a new CommitteeApplication", async () => {
      const response = await chai.request(app)
        .post('/committee/application/create')
        .send(testSubscriber);
      const foundApplication = (await database.query(`SELECT * FROM committeeapplications WHERE email ='${testSubscriber.email}'`))[0][0];

      expect(foundApplication).to.be.not.null;
      expect(response).to.have.status(HTTP_OK);
      expect(response.text).to.contain("Success");
      await database.query(`DELETE FROM committeeapplications WHERE email='${testSubscriber.email}'`);
    });
  });
};
