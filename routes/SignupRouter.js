"use strict";

const express = require('express');

const authHelpers = require('../helpers/AuthHelpers');

const SignupRouter = (database) => {
  const router = express.Router();

  const signupController = require("../controllers/SignupController")(database);

  // Sign up Page
  router.get('/', authHelpers.attachReCAPTCHAKey, signupController.signUp);
  // Creating a new subscription
  router.post('/subscription/create', authHelpers.verifyReCAPTCHA, authHelpers.attachReCAPTCHAKey, signupController.createSubscription);
  // Confirming a subscription
  router.get('/subscription/confirm', signupController.confirmSubscription);
  // Removing a subscription
  router.delete('/subscription/remove', signupController.removeSubscription);
  // Route for unsubscribe links in emails
  router.get('/subscription/remove', signupController.removeSubscription);
  // Route for applying to the committee
  router.post('/committee/apply', authHelpers.verifyReCAPTCHA, authHelpers.attachReCAPTCHAKey, signupController.committeeApply);
  // Route for applying to volunteer
  router.post('/volunteer/apply', authHelpers.verifyReCAPTCHA, authHelpers.attachReCAPTCHAKey, signupController.volunteerApply);

  return router;
};


module.exports = SignupRouter;
