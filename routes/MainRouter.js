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
  // Creating a new subscription
  router.get('/subscription/create', mainController.createSubscription);
  // Confirming a subscription
  router.get('/subscription/confirm', mainController.confirmSubscription);
  // Removing a subscription
  router.get('/subscription/remove', mainController.removeSubscription);
  // All subscriptions
  //router.get('/subscription/list', mainController.listSubscriptions);

  return router;
};


module.exports = MainRouter;
