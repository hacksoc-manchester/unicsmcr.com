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
      // Cleaning up database from previous tests
      await database.query(`DELETE FROM committeeapplications WHERE email = '${testSubscriber.email}'`);
      // Creating new application
      const newApplication = await dbHelpers.createCommitteeApplication(database, testSubscriber);
      // Finding the created application
      const foundApplication = (await database.query(`SELECT * FROM committeeapplications WHERE email = '${testSubscriber.email}'`))[0][0];

      // Checking if a correct application was created
      expect(applicationsAreEqual(newApplication, testSubscriber), "Equal to original value").to.be.true;
      expect(applicationsAreEqual(newApplication, foundApplication), "Equal to found value").to.be.true;

      // Cleaning up
      await database.query(`DELETE FROM committeeapplications WHERE email = '${testSubscriber.email}'`);
    });

    mocha.it("Should create a new VolunteerApplication", async () => {
      // Cleaning up database from previous tests
      await database.query(`DELETE FROM volunteerapplications WHERE email = '${testSubscriber.email}'`);
      // Creating new application
      const newApplication = await dbHelpers.createVolunteerApplication(database, testSubscriber);
      // Finding the created application
      const foundApplication = (await database.query(`SELECT * FROM volunteerapplications WHERE email = '${testSubscriber.email}'`))[0][0];

      // Checking if a correct application was created
      expect(applicationsAreEqual(newApplication, testSubscriber), "Equal to original value").to.be.true;
      expect(applicationsAreEqual(newApplication, foundApplication), "Equal to found value").to.be.true;

      // Cleaning up
      await database.query(`DELETE FROM volunteerapplications WHERE email = '${testSubscriber.email}'`);
    });

    const miscHelpers = require("../helpers/MiscHelpers");
    const testCVSubmission = {
      firstName: "John",
      lastName: "Doe",
      email: "test@email.com",
      password: "testtest"
    };

    mocha.it("Should create a new CVSubmission", async () => {
      // Cleaning up database from previous tests
      await database.query(`DELETE FROM cvsubmissions WHERE email = '${testCVSubmission.email}'`);
      // Creating new submission
      const newSubmission = await dbHelpers.createCVSubmission(database, testCVSubmission);
      // Finding the created submission
      const foundSubmission = (await database.query(`SELECT * FROM cvsubmissions WHERE email = '${testCVSubmission.email}'`))[0][0];

      // Checking if a correct submission was created
      expect(submissionsAreEqual(newSubmission, { ...testCVSubmission, password: miscHelpers.hashPassword(testCVSubmission.password) }), "Equal to original").to.be.true;
      expect(submissionsAreEqual(newSubmission, foundSubmission), "Equal to found").to.be.true;
      testCVSubmission.emailToken = newSubmission.emailToken;
    });

    mocha.it("Should find an existing CVSubmission by id", async () => {
      // Finding the existing submission with a raw query
      const foundSubmissionRaw = (await database.query(`SELECT * FROM cvsubmissions WHERE email = '${testCVSubmission.email}'`))[0][0];
      // Finding the existing submission through dbHelpers
      const foundSubmission = await dbHelpers.findCVSubmission(database, foundSubmissionRaw.id);

      // Checking if the correct submission was found
      expect(submissionsAreEqual(foundSubmission, { ...testCVSubmission, password: miscHelpers.hashPassword(testCVSubmission.password) }), "Equal to original").to.be.true;
      expect(submissionsAreEqual(foundSubmissionRaw, foundSubmission), "Equal to found").to.be.true;
      testCVSubmission.id = foundSubmission.id;
    });

    mocha.it("Should find an existing CVSubmission by email", async () => {
      // Finding the existing submission through dbHelpers
      const foundSubmission = await dbHelpers.findCVSubmissionByEmail(database, testCVSubmission.email, false);

      // Checking if the correct submission was found
      expect(submissionsAreEqual(foundSubmission, { ...testCVSubmission, password: miscHelpers.hashPassword(testCVSubmission.password) }), "Equal to original").to.be.true;
    });

    mocha.it("Should find an existing CVSubmission by email and token", async () => {
      // Finding the existing submission through dbHelpers
      const foundSubmission = await dbHelpers.findCVSubmissionByEmailAndToken(database, testCVSubmission.email, testCVSubmission.emailToken, false);

      // Checking if the correct submission was found
      expect(submissionsAreEqual(foundSubmission, { ...testCVSubmission, password: miscHelpers.hashPassword(testCVSubmission.password) }), "Equal to original").to.be.true;
    });

    mocha.it("Should find an existing CVSubmission by email and password", async () => {
      // Finding the existing submission through dbHelpers
      const foundSubmission = await dbHelpers.findCVSubmissionByEmailAndPassword(
        database,
        testCVSubmission.email,
        miscHelpers.hashPassword(testCVSubmission.password),
        false
      );

      // Checking if the correct submission was found
      expect(submissionsAreEqual(foundSubmission, { ...testCVSubmission, password: miscHelpers.hashPassword(testCVSubmission.password) }), "Equal to original").to.be.true;
    });


    mocha.it("Should edit a CVSubmission", async () => {
      testCVSubmission.cvLink = "test.com";
      testCVSubmission.github = "github.com";
      testCVSubmission.linkedIn = "linkedIn.com";
      // Updating the submission
      await dbHelpers.updateCVSubmission(database, testCVSubmission, { cvLink: "test.com", github: "github.com", linkedIn: "linkedIn.com" });
      // Finding the updated submission
      const foundSubmission = await dbHelpers.findCVSubmission(database, testCVSubmission.id);

      // Checking if correct changes were made
      expect(foundSubmission.cvLink).to.equal(testCVSubmission.cvLink);
      expect(foundSubmission.github).to.equal(testCVSubmission.github);
      expect(foundSubmission.linkedIn).to.equal(testCVSubmission.linkedIn);
    });

    mocha.it("Should reset the password of a CVSubmission", async () => {
      testCVSubmission.password = "testtest1";
      const { email, emailToken, password } = testCVSubmission;

      // Resetting the password
      await dbHelpers.resetPasswordForCVSubmission(database, email, emailToken, password);
      // Finding the updated submission
      const foundSubmission = await dbHelpers.findCVSubmission(database, testCVSubmission.id);

      // Checking if correct changes were made
      expect(submissionsAreEqual(foundSubmission, { ...testCVSubmission, password: miscHelpers.hashPassword(testCVSubmission.password) }), "Equal to original").to.be.true;
    });

    mocha.it("Should verify the email for a CVSubmission", async () => {
      // Updating the submission
      await dbHelpers.verifyCVSubmission(database, testCVSubmission);
      // Finding the verified submission
      const foundSubmission = await dbHelpers.findCVSubmissionByEmail(database, testCVSubmission.email);

      // Checking if correct changes were made
      expect(submissionsAreEqual(foundSubmission, { ...testCVSubmission, password: miscHelpers.hashPassword(testCVSubmission.password) }), "Equal to original").to.be.true;
    });

    mocha.it("Should publish a CVSubmission", async () => {
      // Updating the submission
      await dbHelpers.publishCVSubmission(database, testCVSubmission);
      // Finding the verified submission
      const foundSubmission = await dbHelpers.findCVSubmissionByEmail(database, testCVSubmission.email);

      // Checking if correct changes were made
      expect(submissionsAreEqual(foundSubmission, { ...testCVSubmission, password: miscHelpers.hashPassword(testCVSubmission.password) }), "Equal to original").to.be.true;
      expect(foundSubmission.submissionStatus).to.equal(true);
      testCVSubmission.submissionStatus = true;
    });

    mocha.it("Should make a CVSubmission private", async () => {
      // Updating the submission
      await dbHelpers.publishCVSubmission(database, testCVSubmission);
      // Finding the verified submission
      const foundSubmission = await dbHelpers.findCVSubmissionByEmail(database, testCVSubmission.email);

      // Checking if correct changes were made
      expect(submissionsAreEqual(foundSubmission, { ...testCVSubmission, password: miscHelpers.hashPassword(testCVSubmission.password) }), "Equal to original").to.be.true;
      expect(foundSubmission.submissionStatus).to.equal(false);
      // Cleaning up
      await database.query(`DELETE FROM cvsubmissions WHERE email = '${testCVSubmission.email}'`);
    });

    const testJobListing = {
      position: "Tester",
      company: "Testing Inc.",
      location: "Testchester",
      description: "testing",
      applyLink: "test.com/apply",
      logoLink: "test.com/logo"
    };

    mocha.it("Should create a new JobPosting", async () => {
      // Cleaning up database from previous tests
      await database.query(`DELETE FROM jobpostings WHERE description = '${testJobListing.description}'`);

      const newPosting = await dbHelpers.createJobPosting(database, testJobListing);
      const foundPosting = (await database.query(`SELECT * FROM jobpostings where description = '${testJobListing.description}'`))[0][0];

      expect(jobPostingsAreEqual(testJobListing, newPosting), "Equal to original").to.be.true;
      expect(jobPostingsAreEqual(foundPosting, newPosting), "Equal to found").to.be.true;

      // Cleaning up
      await database.query(`DELETE FROM jobpostings WHERE description = '${testJobListing.description}'`);
    });
    mocha.it("Should get all JobPostings", async () => {
      await dbHelpers.createJobPosting(database, testJobListing);

      const foundPostingsSQL = (await database.query(`SELECT * FROM jobpostings`))[0];
      const foundPostingsHelper = await dbHelpers.getJobs(database);

      expect(foundPostingsSQL.length).to.equal(foundPostingsHelper.length);
      foundPostingsSQL.forEach(posting => {
        const correspondingPosting = foundPostingsHelper.find(p => p.id == posting.id);

        expect(correspondingPosting).to.be.not.null;
        expect(jobPostingsAreEqual(posting, correspondingPosting), "Equal to found").to.be.true;
      });

      // Cleaning up
      await database.query(`DELETE FROM jobpostings WHERE description = '${testJobListing.description}'`);
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

const submissionsAreEqual = (submissionA, submissionB) => {
  return submissionA.email == submissionB.email &&
    submissionA.password == submissionB.password &&
    submissionA.firstName == submissionB.firstName &&
    submissionA.lastName == submissionB.lastName;
};

const jobPostingsAreEqual = (postingA, postingB) => {
  return postingA.position == postingB.position &&
    postingA.company == postingB.company &&
    postingA.location == postingB.location &&
    postingA.description == postingB.description &&
    postingA.applyLink == postingB.applyLink &&
    postingA.logoLink == postingB.logoLink;
};