"use strict";

const express = require('express');

const authHelpers = require('../helpers/AuthHelpers');

const MainRouter = (database, passport) => {
  const router = express.Router();

  const mainController = require('../controllers/MainController')(database);

  // Home Page
  router.get('/', mainController.index);
  // Contact Page
  router.get('/contact', authHelpers.attachReCAPTCHAKey, mainController.contact);
  // Contacting HackSoc
  router.post('/contact', authHelpers.verifyReCAPTCHA, authHelpers.attachReCAPTCHAKey, mainController.contactHackSoc);
  // Message Page
  router.get('/message', mainController.message);
  // Team Page
  router.get('/team', mainController.team);
  // Partners Page
  router.get('/partners', mainController.partners);
  // Gallery Page
  router.get('/gallery', mainController.gallery);
  // Sign up Page
  router.get('/signup', authHelpers.attachReCAPTCHAKey, mainController.signUp);
  // Privacy Page
  router.get('/privacy', mainController.privacy);
  // Creating a new subscription
  router.post('/subscription/create', authHelpers.verifyReCAPTCHA, authHelpers.attachReCAPTCHAKey, mainController.createSubscription);
  // Confirming a subscription
  router.get('/subscription/confirm', mainController.confirmSubscription);
  // Removing a subscription
  router.delete('/subscription/remove', mainController.deleteRemoveSubscription);
  // Route for unsubscribe links in emails
  router.get('/subscription/remove', mainController.getRemoveSubscription);
  // Route for applying to the committee
  router.post('/committee/application/create', authHelpers.verifyReCAPTCHA, authHelpers.attachReCAPTCHAKey, mainController.committeeApply);
  // Route for applying to volunteer
  router.post('/volunteer/application/create', authHelpers.verifyReCAPTCHA, authHelpers.attachReCAPTCHAKey, mainController.volunteerApply);
  // CV Bank login page
  router.get('/cv/login', mainController.cvLogin);
  // Route for logging into the CV bank
  router.post('/cv/login', passport.authenticate('local', { failureRedirect: '/cv/login', failureFlash: true }), mainController.cvSubmission);
  // Route for logging out of the CV bank
  router.post('/cv/logout', mainController.cvLogout);
  // CV Bank register page
  router.get('/cv/register', authHelpers.attachReCAPTCHAKey, mainController.cvRegister);
  // Router for registering to the CV bank
  router.post('/cv/register', authHelpers.verifyReCAPTCHA, authHelpers.attachReCAPTCHAKey, mainController.cvCreateSubmission);
  // CV Bank password reset page
  router.get('/cv/passwordreset', authHelpers.attachReCAPTCHAKey, mainController.cvPasswordReset);
  // Route to request a password reset for a cv submission
  router.post('/cv/passwordreset', mainController.cvRequestPasswordReset);
  // CV Bank submission page
  router.get('/cv/submission', authHelpers.loggedInToCVBank, mainController.cvSubmission);
  // CV Bank submission password reset page
  router.get('/cv/submission/passwordreset', mainController.cvSubmissionPasswordResetPage);
  // CV Bank submission password reset page
  router.post('/cv/submission/passwordreset', mainController.cvSubmissionPasswordReset);
  // Route to edit a cv submission
  router.post('/cv/submission/edit', authHelpers.loggedInToCVBank, mainController.cvEditSubmission);
  // Route to verify the email of a cv submission
  router.get('/cv/submission/verify', mainController.cvVerifySubmission);
  // Route to publish a cv submission
  router.post('/cv/submission/publish', authHelpers.loggedInToCVBank, mainController.cvPublishSubmission);

  return router;
};


module.exports = MainRouter;
