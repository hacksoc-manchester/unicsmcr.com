"use strict";

const express = require('express');

const authHelpers = require('../helpers/AuthHelpers');

const CVRouter = (database, passport) => {
  const router = express.Router();

  const cvController = require("../controllers/CVController")(database);

  // CV Bank login page
  router.get('/login', cvController.login);
  // Route for logging into the CV bank
  router.post('/login', passport.authenticate('local', { failureRedirect: '/cv/login', failureFlash: true }), cvController.submission);
  // Route for logging out of the CV bank
  router.post('/logout', cvController.logout);
  // CV Bank register page
  router.get('/register', authHelpers.attachReCAPTCHAKey, cvController.register);
  // Router for registering to the CV bank
  router.post('/register', authHelpers.verifyReCAPTCHA, authHelpers.attachReCAPTCHAKey, cvController.createSubmission);
  // CV Bank password reset page
  router.get('/passwordreset', authHelpers.attachReCAPTCHAKey, cvController.passwordReset);
  // Route to request a password reset for a cv submission
  router.post('/passwordreset', cvController.requestPasswordReset);
  // CV Bank submission page
  router.get('/submission', authHelpers.loggedInToCVBank, cvController.submission);
  // CV Bank submission password reset page
  router.get('/submission/passwordreset', cvController.submissionPasswordResetPage);
  // CV Bank submission password reset page
  router.post('/submission/passwordreset', cvController.submissionPasswordReset);
  // Route to edit a cv submission
  router.post('/submission/edit', authHelpers.loggedInToCVBank, cvController.editSubmission);
  // Route to verify the email of a cv submission
  router.get('/submission/verify', cvController.verifySubmission);
  // Route to publish a cv submission
  router.post('/submission/publish', authHelpers.loggedInToCVBank, cvController.publishSubmission);

  return router;
};


module.exports = CVRouter;
