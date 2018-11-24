"use strict";

const express = require('express');

const authHelpers = require('../helpers/AuthHelpers');

const MainRouter = (database, passport) => {
  const router = express.Router();

  const mainController = require('../controllers/MainController')();

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
  // Privacy Page
  router.get('/privacy', mainController.privacy);
  // Sponsors Page
  router.get('/sponsors', mainController.sponsors);
  // The list of all events
  router.get('/events', mainController.getEvents);

  router.get('/qr', mainController.qr);


  const cvRouter = require("./CVRouter")(database, passport);

  router.use("/cv/", cvRouter);

  const singupRouter = require("./SignupRouter")(database, passport);

  router.use("/signup/", singupRouter);

  // Redirects for links in old emails
  router.get("/subscription/confirm", (req, res) => {
    const { email, subscriptionId, firstName, lastName } = req.query;

    res.redirect(301, `/signup/subscription/confirm?email=${email}&subscriptionId=${subscriptionId}&firstName=${firstName}&lastName=${lastName}`);
  });
  router.get("/subscription/remove", (req, res) =>
    res.redirect(301, `/signup/subscription/remove?email=${req.query.email}&subscriptionId=${req.query.subscriptionId}`));

  const jobsRouter = require("./JobsRouter")(database);

  router.use("/jobs/", jobsRouter);

  return router;
};


module.exports = MainRouter;
