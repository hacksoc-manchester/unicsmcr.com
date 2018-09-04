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


  const cvRouter = require("./CVRouter");

  router.all("/cv/", (req, res) => res.redirect("/cv/"));
  router.use("/cv/", cvRouter(database, passport));

  const singupRouter = require("./SignupRouter");

  // TODO: test out
  // Redirects for links in old emails
  router.get("/subscription/confirm", (req, res) => res.redirect("/signup/subscription/confirm"));
  router.get("/subscription/remove", (req, res) => res.redirect("/signup/subscription/remove"));

  router.all("/signup/", (req, res) => res.redirect("/signup/"));
  router.use("/signup/", singupRouter(database, passport));

  return router;
};


module.exports = MainRouter;
