// Tests to check if user-accessible CV bank methods (without reCAPTCHA) work properly
"use strict";

const chai = require("chai");
const expect = require('chai').expect;

const dbHelpers = require('../helpers/DbHelpers');
const miscHelpers = require('../helpers/MiscHelpers');

const HTTP_OK = 200;

module.exports = (mocha, app) => {
  const dbConnection = require('../db/Sequelize');
  const database = dbConnection.init();

  const testCVSubmission = {
    firstName: "John",
    lastName: "Doe",
    email: "test@email.com",
    password: "testtest"
  };
  let agent = {};

  mocha.describe("CV Bank tests:", () => {
    mocha.it("Should verify email address for CV submission", async () => {
      // Cleaning up database from previous tests
      await database.query(`DELETE FROM cvsubmissions WHERE email = '${testCVSubmission.email}'`);
      // Creating a new CvSubmission
      const newSubmission = await dbHelpers.createCVSubmission(database, testCVSubmission);

      expect(newSubmission.emailVerified).to.be.false;
      testCVSubmission.id = newSubmission.id;
      testCVSubmission.emailToken = newSubmission.emailToken;

      const response = await chai.request(app)
        .get("/cv/submission/verify")
        .query({ email: testCVSubmission.email, emailToken: testCVSubmission.emailToken });

      expect(response).to.have.status(HTTP_OK);
      const updatedSubmission = await dbHelpers.findCVSubmission(database, testCVSubmission.id);

      expect(updatedSubmission.emailVerified).to.be.true;
    });

    mocha.it("Should login to an existing CV submission", async () => {
      agent = chai.request.agent(app);
      const response = await agent.post("/cv/login/")
        .type("urlencoded")
        .send({
          _method: "post",
          email: testCVSubmission.email,
          password: testCVSubmission.password
        });

      expect(response).to.have.status(HTTP_OK);
      expect(response.req.path).to.equal("/cv/submission/");
    });

    mocha.it("Should redirect to CV submission page when going to /cv/login after logging in", async () => {
      const response = await agent.get("/cv/login/");

      expect(response).to.have.status(HTTP_OK);
      expect(response.req.path).to.equal("/cv/submission/");
    });

    mocha.it("Should not publish CV with no cvLink set", async () => {
      const response = await agent.post("/cv/submission/publish");

      expect(response).to.have.status(HTTP_OK);
      const updatedSubmission = await dbHelpers.findCVSubmissionByEmail(database, testCVSubmission.email);

      expect(updatedSubmission.submissionStatus).to.be.false;
    });

    mocha.it("Should edit CV submission after logging in", async () => {
      testCVSubmission.cvLink = "cvlink.com";
      testCVSubmission.github = "github.com";
      testCVSubmission.linkedIn = "linkedIn.com";
      const response = await agent.post("/cv/submission/edit")
        .type("urlencoded")
        .send({
          _method: "post",
          ...testCVSubmission
        });

      expect(response).to.have.status(HTTP_OK);
      const updatedSubmission = await dbHelpers.findCVSubmissionByEmail(database, testCVSubmission.email);

      expect(updatedSubmission.cvLink).to.equal(testCVSubmission.cvLink);
      expect(updatedSubmission.github).to.equal(testCVSubmission.github);
      expect(updatedSubmission.linkedIn).to.equal(testCVSubmission.linkedIn);
    });


    mocha.it("Should publish CV after logging in", async () => {
      const response = await agent.post("/cv/submission/publish");

      expect(response).to.have.status(HTTP_OK);
      const updatedSubmission = await dbHelpers.findCVSubmissionByEmail(database, testCVSubmission.email);

      expect(updatedSubmission.submissionStatus).to.be.true;
    });

    mocha.it("Should publish CV after logging in", async () => {
      const response = await agent.post("/cv/submission/publish");

      expect(response).to.have.status(HTTP_OK);
      const updatedSubmission = await dbHelpers.findCVSubmissionByEmail(database, testCVSubmission.email);

      expect(updatedSubmission.submissionStatus).to.be.false;
    });

    mocha.it("Should reset CV submission password", async () => {
      testCVSubmission.password = "testtest1";
      const response = await agent.post("/cv/submission/passwordreset")
        .type("urlencoded")
        .send({
          _method: "post",
          email: testCVSubmission.email,
          emailToken: testCVSubmission.emailToken,
          password: testCVSubmission.password,
          passwordConfirmation: testCVSubmission.password
        });

      expect(response).to.have.status(HTTP_OK);
      const updatedSubmission = await dbHelpers.findCVSubmissionByEmail(database, testCVSubmission.email);

      expect(updatedSubmission.password).to.equal(miscHelpers.hashPassword(testCVSubmission.password));
    });

    mocha.it("Should log out", async () => {
      const response = await agent.post("/cv/logout/");

      expect(response).to.have.status(HTTP_OK);
      expect(response.req.path).to.equal("/cv/login/");
      const loggedOutResponse = await agent.get("/cv/submission");

      expect(loggedOutResponse).to.have.status(HTTP_OK);
      expect(loggedOutResponse.req.path).to.equal("/cv/login/");

      // Cleaning up
      agent.close();
      await database.query(`DELETE FROM cvsubmissions WHERE email = '${testCVSubmission.email}'`);
    });
  });
};
