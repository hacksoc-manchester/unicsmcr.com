// Helper funcitons for automated tests
"use strict";

const chai = require('chai');
const expect = chai.expect;

const HTTP_OK = 200;

// Basic test to check if a route works as expected
exports.pageLoadedSuccessfully = (err, res, done, noOfRedirects = 0, finalUrl = "") => {
  expect(err, "Error").to.be.null; // No errors encountered
  expect(res.redirects.length, "Number of Redirects").to.be.equal(noOfRedirects); // The required number of redirects happened
  expect(res.req.path, "Returned URL").to.contain(finalUrl); // The required page was returned
  expect(res.status, "Response Status").to.be.equal(HTTP_OK); // Response status is HTTP_OK
  return done();
};

// Runs all tests in given array
exports.runTests = (tests, mocha, app) => {
  tests.forEach(test => {
    mocha.it(test.title, function (done) {
      chai.request(app)
        .get(test.url)
        .end(function (err, res) {
          if (test.testSpecificChecks) {
            test.testSpecificChecks(test, err, res, done);
          }
          return exports.pageLoadedSuccessfully(err, res, done, test.noOfRedirects || 0, test.finalUrl || test.url);
        });
    });
  });
};
