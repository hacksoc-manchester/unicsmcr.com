"use strict";

const express = require('express');

const authHelpers = require('../helpers/AuthHelpers');

const MainRouter = (database) => {
  const router = express.Router();

  const mainController = require('../controllers/MainController')(database);

  // Home Page
  router.get('/', mainController.index);
  // Contact Page
  router.get('/contact', mainController.contact);
  // Contacting HackSoc
  router.post('/contact', authHelpers.verifyReCAPTCHA, mainController.contactHackSoc);
  // Message Page
  router.get('/message', mainController.message);
  // Team Page
  router.get('/team', mainController.team);
  // Partners Page
  router.get('/partners', mainController.partners);
  // Gallery Page
  router.get('/gallery', mainController.gallery);
  // Sign up Page
  router.get('/signup', mainController.signUp);
  // Privacy Page
  router.get('/privacy', mainController.privacy);
  // Creating a new subscription
  router.post('/subscription/create', authHelpers.verifyReCAPTCHA, mainController.createSubscription);
  // Confirming a subscription
  router.get('/subscription/confirm', mainController.confirmSubscription);
  // Removing a subscription
  router.delete('/subscription/remove', mainController.deleteRemoveSubscription);
  // Route for unsubscribe links in emails
  router.get('/subscription/remove', mainController.getRemoveSubscription);

  return router;
};


module.exports = MainRouter;
