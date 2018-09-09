"use strict";

const teamService = require('../services/TeamService');
const partnersService = require('../services/PartnersService');
const galleryService = require('../services/GalleryService');
const emailService = require('../services/EmailService');
const subscriptionsService = require('../services/SubscriptionsService');

const dbHelpers = require('../helpers/DbHelpers');

module.exports = (database) => {
  this.index = (req, res, next) => {
    try {
      res.render('pages/index');
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.contact = (req, res, next) => {
    try {
      res.render('pages/contact');
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.message = (req, res, next) => {
    try {
      const { title, message } = req.query;

      if (!title || !message) {
        return next({
          type: "message",
          title: "Error",
          message: "Invalid parameters provided.<br>If you believe this shouldn't have happened please contact us at contact@hacksoc.com"
        });
      }
      return res.render('pages/message', { title, message });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.contactHackSoc = (req, res, next) => {
    try {
      const { name, email, message, captchaMessage } = req.body;

      if (captchaMessage) {
        return res.render("pages/contact", { error: captchaMessage });
      }
      const sender = `${name || "Name not specified"}: ${email || "Email not specified"}`;

      emailService.contactHackSoc(sender, message);
      res.render('pages/message', { title: 'Contact', message: "Thank you! Your message has been received." });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.team = (req, res, next) => {
    try {
      res.render('pages/team', {
        team: teamService.getCurrentTeam(),
        hallOfFame: teamService.getHallOfFame()
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.partners = (req, res, next) => {
    try {
      res.render('pages/partners', { partners: partnersService.getPartners() });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.gallery = (req, res, next) => {
    try {
      galleryService.getGalleries((err, galleries) => {
        if (err) {
          console.log(err);
          return next({
            type: "message",
            title: "Gallery",
            message: "Could not load the gallery. Sorry!"
          });
        }
        res.render('pages/gallery', { galleries: galleries || [] });
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.signUp = (req, res, next) => {
    try {
      res.render('pages/signup');
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  // Creates a subscription to the newsletter
  this.createSubscription = async (req, res) => {
    try {
      const { firstName, lastName, email, agreeToPrivacyPolicy, captchaMessage } = req.body;

      // Checking if all parameters were provided
      if (!firstName || !lastName || !email) {
        return res.render("pages/signup", { newsletterError: "Please fill in all fields!", selectedForm: "newsletter" });
      }
      // Checking if user agreed to the privacy policy
      if (!agreeToPrivacyPolicy) {
        return res.render("pages/signup", { newsletterError: "Please agree to the privacy policy.", selectedForm: "newsletter" });
      }
      // Checking if user passed the turing test
      if (captchaMessage) {
        return res.render("pages/signup", { newsletterError: captchaMessage, selectedForm: "newsletter" });
      }
      // Creating application
      await subscriptionsService.createSubscriber(database, { firstName, lastName, email });
      return res.render("pages/message", { title: "Success", message: "Thank you for subscribing to our mailing list!" });
    } catch (err) {
      console.log(err);
      return res.render("pages/signup", { newsletterError: err, selectedForm: "newsletter" });
    }
  };

  this.getRemoveSubscription = async (req, res, next) => {
    try {
      const { email, subscriptionId } = req.query;

      if (!subscriptionId || !email) {
        return next({
          type: "message",
          title: "Error",
          message: "Invalid parameters provided.<br>If you believe this shouldn't have happened please contact us at contact@hacksoc.com"
        });
      }
      await subscriptionsService.removeSubscriber(database, { email, subscriptionId });
      return res.render("pages/message", { title: "Success", message: "Your subscription has been removed successfully!" });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.deleteRemoveSubscription = async (req, res, next) => { // REVIEW: code repetition
    try {
      const { email, subscriptionId } = req.body;

      if (!subscriptionId || !email) {
        return next({
          type: "message",
          title: "Error",
          message: "Invalid parameters provided.<br>If you believe this shouldn't have happened please contact us at contact@hacksoc.com"
        });
      }
      await subscriptionsService.removeSubscriber(database, { email, subscriptionId });
      return res.render("pages/message", { title: "Success", message: "Your subscription has been removed successfully!" });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.confirmSubscription = async (req, res, next) => {
    try {
      const { firstName, lastName, email, subscriptionId } = req.query;

      if (!firstName || !lastName || !email || !subscriptionId) {
        return next({
          type: "message",
          title: "Error",
          message: "Invalid parameters provided.<br>If you believe this shouldn't have happened please contact us at contact@hacksoc.com"
        });
      }

      try {
        await subscriptionsService.confirmSubscription(database, {
          firstName,
          lastName,
          email,
          subscriptionId
        });
      } catch (err) {
        return next({
          type: "message",
          title: "Error",
          message: "Invalid parameters provided.<br>If you believe this shouldn't have happened please contact us at contact@hacksoc.com"
        });
      }
      return res.render("pages/message", { title: "Success", message: "Thank you for subscribing to our mailing list!" });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.listSubscriptions = async (req, res, next) => {
    try {
      const subscribers = await subscriptionsService.subscribersList(database);

      res.send(subscribers);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.privacy = (req, res, next) => {
    try {
      res.render("pages/privacy");
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  // Creates an application to the committee
  this.committeeApply = async (req, res) => {
    try {
      const { firstName, lastName, email, teams, reasonToJoin, agreeToPrivacyPolicy, captchaMessage } = req.body;

      // Checking if all parameters were provided
      if (!firstName || !lastName || !email || !teams || !reasonToJoin) {
        return res.render("pages/signup", { committeeError: "Please fill in all required fields!", selectedForm: "committee" });
      }
      // Checking if user agreed to the privacy policy
      if (!agreeToPrivacyPolicy) {
        return res.render("pages/signup", { committeeError: "Please agree to the privacy policy.", selectedForm: "committee" });
      }
      // Checking if user passed the turing test
      if (captchaMessage) {
        return res.render("pages/signup", { committeeError: captchaMessage, selectedForm: "committee" });
      }
      // Creating application
      await dbHelpers.createCommitteeApplication(database, req.body);
      return res.render("pages/message", { title: "Success", message: "You have successfully applied to join our committee!<br>We will contact you as soon as a position becomes available." });
    } catch (err) {
      console.log(err);
      return res.render("pages/signup", { committeeError: err, selectedForm: "committee" });
    }
  };

  // Creates an application to volunteer
  this.volunteerApply = async (req, res) => {
    try {
      const { firstName, lastName, email, teams, reasonToJoin, agreeToPrivacyPolicy, captchaMessage } = req.body;

      // Checking if all parameters were provided
      if (!firstName || !lastName || !email || !teams || !reasonToJoin) {
        return res.render("pages/signup", { volunteerError: "Please fill in all required fields!", selectedForm: "volunteer" });
      }
      // Checking if user agreed to the privacy policy
      if (!agreeToPrivacyPolicy) {
        return res.render("pages/signup", { volunteerError: "Please agree to the privacy policy.", selectedForm: "volunteer" });
      }
      // Checking if user passed the turing test
      if (captchaMessage) {
        return res.render("pages/signup", { volunteerError: captchaMessage, selectedForm: "volunteer" });
      }
      // Creating application
      await dbHelpers.createVolunteerApplication(database, req.body);
      return res.render("pages/message", { title: "Success", message: "You have successfully applied to volunteer!<br>We will contact you as soon as we need your help." });
    } catch (err) {
      console.log(err);
      return res.render("pages/signup", { volunteerError: err, selectedForm: "volunteer" });
    }
  };

  return this;
};
