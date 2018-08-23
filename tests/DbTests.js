// Tests to check if database methods work properly
"use strict";

const expect = require('chai').expect;

const dbHelpers = require('../helpers/DbHelpers');

module.exports = (mocha) => {
  const dbConnection = require('../db/Sequelize');
  const database = dbConnection.init();

  const testSubscriber = {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@email.com"
  };

  mocha.describe("Database methods tests:", () => {
    mocha.it("Should create a new Subscriber", (done) => {
      new Promise(async (resolve) => {
        // Removing test subscriber if it is left over from previous tests
        await database.query(`DELETE FROM subscribers WHERE email = '${testSubscriber.email}'`);
        // Create new test subscriber
        const createdSubscriber = await dbHelpers.createSubscriber(database, testSubscriber);
        const foundSubscriber = (await database.query(`SELECT * FROM subscribers WHERE email = '${testSubscriber.email}'`))[0][0];

        resolve({ createdSubscriber, foundSubscriber });
      }).then((data) => {
        const { createdSubscriber, foundSubscriber } = data;

        expect(createdSubscriber).to.be.not.null;
        expect(foundSubscriber).to.be.not.null;
        expect(createdSubscriber.id).to.equal(foundSubscriber.id);
        expect(createdSubscriber.firstName)
          .to.equal(foundSubscriber.firstName)
          .to.equal(testSubscriber.firstName);
        expect(createdSubscriber.lastName)
          .to.equal(foundSubscriber.lastName)
          .to.equal(testSubscriber.lastName);
        expect(createdSubscriber.email)
          .to.equal(foundSubscriber.email)
          .to.equal(testSubscriber.email);
        expect(createdSubscriber.subscriptionId).to.equal(foundSubscriber.subscriptionId);

        testSubscriber.id = createdSubscriber.id;
        testSubscriber.subscriptionId = createdSubscriber.subscriptionId;

        done();
      }).catch((err) => {
        expect(err).to.be.null;
      });
    });

    mocha.it("Should not create a new Subscriber if given email already exists", (done) => {
      new Promise(async (resolve) => {
        try {
          // Create new test subscriber
          await dbHelpers.createSubscriber(database, {
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@email.com"
          });

          resolve("A user with a duplicate email got created");
        } catch (err) {
          resolve(err);
        }
      }).then((err) => {
        expect(String(err)).to.include(`${testSubscriber.email} is already taken`);

        done();
      });
    });

    mocha.it("Should find an existing subscriber by email", (done) => {
      new Promise(async (resolve) => {
        const foundSubscriber = await dbHelpers.findSubscriberByEmail(database, testSubscriber.email);

        resolve(foundSubscriber);
      }).then((subscriber) => {
        expect(subscriber).to.be.not.null;
        expect(subscriber.id).to.equal(testSubscriber.id);
        expect(subscriber.email).to.equal(testSubscriber.email);
        expect(subscriber.firstName).to.equal(testSubscriber.firstName);
        expect(subscriber.lastName).to.equal(testSubscriber.lastName);
        expect(subscriber.subscriptionId).to.equal(testSubscriber.subscriptionId);

        done();
      }).catch((err) => {
        expect(err).to.be.null;
      });
    });

    mocha.it("Should remove an existing subscriber", (done) => {
      new Promise(async (resolve) => {
        await dbHelpers.removeSubscriber(database, testSubscriber);
        const subscriberAfterRemoval = await dbHelpers.findSubscriberByEmail(database, testSubscriber.email);

        resolve(subscriberAfterRemoval);
      }).then((subscriber) => {
        expect(subscriber).to.be.null;

        done();
      }).catch((err) => {
        expect(err).to.be.null;
      });
    });
  });
};
