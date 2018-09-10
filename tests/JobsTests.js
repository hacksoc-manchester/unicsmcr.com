// Tests to check if user-accessible jobs listing methods work properly
"use strict";

const chai = require("chai");
const expect = require('chai').expect;

const dbHelpers = require('../helpers/DbHelpers');

const HTTP_OK = 200;

module.exports = (mocha, app) => {
  const dbConnection = require('../db/Sequelize');
  const database = dbConnection.init();

  const testJobListing = {
    position: "Tester",
    company: "Testing Inc.",
    location: "Testchester",
    description: "testing",
    applyLink: "test.com/apply",
    logoLink: "test.com/logo",
    apiKey: process.env.JOBS_API_KEY
  };


  mocha.describe("Jobs tests:", () => {
    mocha.it("Should create new JobPosting with POST request", async () => {
      // Cleaning up database from previous tests
      await database.query(`DELETE FROM jobpostings WHERE description = '${testJobListing.description}'`);

      const response = await chai.request(app)
        .post("/jobs/create")
        .send(testJobListing);

      expect(response).to.have.status(HTTP_OK);
      const foundPosting = (await dbHelpers.getJobs(database)).find(p => p.company == testJobListing.company && p.description == testJobListing.description);

      expect(foundPosting).to.be.not.null;
      // Cleaning up
      await database.query(`DELETE FROM jobpostings WHERE id = '${foundPosting.id}'`);
    });
  });
};
