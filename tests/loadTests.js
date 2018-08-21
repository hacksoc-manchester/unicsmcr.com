// Tests to check if pages get served properly
"use strict";

const runTests = require('./testHelpers').runTests;

module.exports = (mocha, app) => {
  // Array of tests to be run
  const tests = [
    {
      title: "Should serve Home page", // The title of the page (only required for the name of the test, does not affect the result of the test)
      url: "/", // The url of the page to test
      // (optional) The number of redirects that are expected to happen
      // will be set to 0 if field is not provided
      noOfRedirects: 0,
      // (optional) The url the user should end up in after the test (used to check if redirects were carried out correctly)
      // will be set to the value of url if field is not provided
      finalUrl: "/"
    },
    {
      title: "Should serve Team page",
      url: "/team"
    },
    {
      title: "Should serve Gallery page",
      url: "/gallery"
    },
    {
      title: "Should serve Contact page",
      url: "/contact"
    },
    {
      title: "Should serve Signup page",
      url: "/signup"
    },
    {
      title: "Should serve Events page",
      url: "/events"
    },
    {
      title: "Should serve Jobs page",
      url: "/jobs"
    }
  ];

  runTests(tests, mocha, app);
};
