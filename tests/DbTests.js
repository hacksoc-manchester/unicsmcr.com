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
    email: "johndoe@email.com",
    subjectOfStudy: "Testing Science",
    gender: "tester",
    teams: "testing",
    reasonToJoin: "to test"
  };

  mocha.describe("Database tests:", () => {
    mocha.it("Should create a new Subscriber", async () => {
      // Removing test subscriber if it is left over from previous tests
      await database.query(`DELETE FROM subscribers WHERE email = '${testSubscriber.email}'`);
      // Create new test subscriber
      const createdSubscriber = await dbHelpers.createSubscriber(database, testSubscriber);
      const foundSubscriber = (await database.query(`SELECT * FROM subscribers WHERE email = '${testSubscriber.email}'`))[0][0];

      testSubscriber.id = createdSubscriber.id;
      testSubscriber.subscriptionId = createdSubscriber.subscriptionId;

      expect( // The created Subscriber should be identical to the found Subscriber
        subscribersAreEqual(createdSubscriber, foundSubscriber),
        "Subscribers should be equal"
      ).to.be.true;
      expect( // The created Subscriber should be identical to testSubscriber
        subscribersAreEqual(createdSubscriber, testSubscriber),
        "New Subscriber should be equal to test subscriber data"
      ).to.be.true;
    });

    mocha.it("Should not create a new Subscriber if given email already exists", async () => {
      try {
        // Create new test subscriber
        await dbHelpers.createSubscriber(database, {
          firstName: "John",
          lastName: "Doe",
          email: "johndoe@email.com"
        });

        expect(false).to.be.true; // A new subscriber was created
      } catch (err) {
        expect(String(err)).to.include(`${testSubscriber.email} is already taken`);
      }
    });

    mocha.it("Should find an existing Subscriber by email", async () => {
      const foundSubscriber = await dbHelpers.findSubscriberByEmail(database, testSubscriber.email);

      expect(foundSubscriber).to.be.not.null;
      expect( // Found Subscriber should be identical to testSubscriber
        subscribersAreEqual(foundSubscriber, testSubscriber),
        "Subscribers should be equal"
      ).to.be.true;
    });

    mocha.it("Should remove an existing Subscriber", async () => {
      await dbHelpers.removeSubscriber(database, testSubscriber);
      const subscriberAfterRemoval = await dbHelpers.findSubscriberByEmail(database, testSubscriber.email);

      // No Subscriber should be found after the removal
      expect(subscriberAfterRemoval).to.be.null;
    });

    mocha.it("Should create a new SubscriptionRequest", async () => {
      // Removing the test SubscriptionRequest if it was left over from previous tests
      await database.query(`DELETE FROM subscriptionrequests WHERE subscriberEmail = '${testSubscriber.email}'`);
      // Creating a new SubscriptionRequest
      const createdSubRequest = await dbHelpers.createSubscriptionRequest(database, { subscriberEmail: testSubscriber.email });
      // Searching for the created SubscriptionRequest
      const foundSubRequest = (await database.query(`SELECT * FROM subscriptionrequests WHERE subscriberEmail = '${testSubscriber.email}'`))[0][0];

      expect(createdSubRequest).to.be.not.null;
      expect(foundSubRequest).to.be.not.null;
      expect( // The created SubscriptionRequest should be identical to the found SubscriptionRequest
        subscriptionRequestsAreEqual(createdSubRequest, foundSubRequest),
        "Subscription requests should be equal"
      ).to.be.true;
      testSubscriber.subsciptionId = createdSubRequest.subsciptionId;
    });

    mocha.it("Should not create a new SubscriptionRequest for an email with an existing SubscriptionRequest", async () => {
      const createdSubRequest = await dbHelpers.createSubscriptionRequest(database, { subscriberEmail: testSubscriber.email });

      expect(createdSubRequest).to.be.not.null;
      expect( // The return SubscriptionRequest should be identical to the SubscriptionRequest created in previous tests
        createdSubRequest.subscriberEmail == testSubscriber.email &&
        createdSubRequest.subsciptionId == testSubscriber.subsciptionId,
        "Returned sub request should be equal to the sub request created earlier"
      ).to.be.true;
    });

    mocha.it("Should not create a new SubscriptionRequest for an existing Subscriber", async () => {
      // Preparing the database for the test
      await database.query(`DELETE FROM subscribers WHERE email = '${testSubscriber.email}'`);
      await database.query(`DELETE FROM subscriptionrequests WHERE subscriberEmail = '${testSubscriber.email}'`);
      const newSubscriber = await dbHelpers.createSubscriber(database, testSubscriber);

      try {
        await dbHelpers.createSubscriptionRequest(database, { subscriberEmail: testSubscriber.email });

        // An error should be thrown since the Subscriber already exists
        expect(false, "Should throw an error").to.be.true;
      } catch (err) {
        expect(String(err)).to.include(`Subscriber ${testSubscriber.email} already exists!`);
      }
      // Cleaning the database
      await dbHelpers.removeSubscriber(database, newSubscriber);
    });

    mocha.it("Should confirm an existing SubscriptionRequest", async () => {
      const newSubRequest = await dbHelpers.createSubscriptionRequest(database, { subscriberEmail: testSubscriber.email });

      // Confirming the test SubscriptionRequest
      await dbHelpers.confirmSubscriptionRequest(database, {
        subscriptionId: newSubRequest.subscriptionId,
        subscriberEmail: testSubscriber.email
      });
      // Searching for the test SubscriptionRequest
      const foundSubRequest = (await database.query(`SELECT * FROM subscriptionrequests WHERE subscriberEmail = '${testSubscriber.email}'`))[0][0];

      // The test SubscriptionRequest should not be found since it should've been deleted when it was confirmed
      expect(foundSubRequest, "Subscription request should get deleted").to.be.undefined;
    });

    mocha.it("Should create a new CommitteeApplication", async () => {
      await database.query(`DELETE FROM committeeapplications WHERE email = '${testSubscriber.email}'`);
      const newApplication = await dbHelpers.createCommitteeApplication(database, testSubscriber);
      const foundApplication = (await database.query(`SELECT * FROM committeeapplications WHERE email = '${testSubscriber.email}'`))[0][0];

      expect(applicationsAreEqual(newApplication, testSubscriber), "Equal to original value").to.be.true;
      expect(applicationsAreEqual(newApplication, foundApplication), "Equal to found value").to.be.true;

      await database.query(`DELETE FROM committeeapplications WHERE email = '${testSubscriber.email}'`);
    });

    mocha.it("Should create a new VolunteerApplication", async () => {
      await database.query(`DELETE FROM volunteerapplications WHERE email = '${testSubscriber.email}'`);
      const newApplication = await dbHelpers.createVolunteerApplication(database, testSubscriber);
      const foundApplication = (await database.query(`SELECT * FROM volunteerapplications WHERE email = '${testSubscriber.email}'`))[0][0];

      expect(applicationsAreEqual(newApplication, testSubscriber), "Equal to original value").to.be.true;
      expect(applicationsAreEqual(newApplication, foundApplication), "Equal to found value").to.be.true;

      await database.query(`DELETE FROM volunteerapplications WHERE email = '${testSubscriber.email}'`);
    });
  });

};

const subscribersAreEqual = (subscriberA, subscriberB) => {
  return subscriberA.id == subscriberB.id &&
    subscriberA.email == subscriberB.email &&
    subscriberA.firstName == subscriberB.firstName &&
    subscriberA.lastName == subscriberB.lastName &&
    subscriberA.subscriptionId == subscriberB.subscriptionId;
};

const subscriptionRequestsAreEqual = (requestA, requestB) => {
  return requestA.id == requestB.id &&
    requestA.email == requestB.email &&
    requestA.subsciptionId == requestB.subsciptionId;
};

const applicationsAreEqual = (applicationA, applicationB) => {
  return applicationA.email == applicationB.email &&
    applicationA.firstName == applicationB.firstName &&
    applicationA.lastName == applicationB.lastName &&
    applicationA.gender == applicationB.gender &&
    applicationA.teams == applicationB.teams &&
    applicationA.reasonToJoin == applicationB.reasonToJoin &&
    applicationA.subjectOfStudy == applicationB.subjectOfStudy;
};
