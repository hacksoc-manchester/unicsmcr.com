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
      res.render('pages/contact', { recaptchaKey: process.env.G_RECAPTCHA_KEY });
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
          message: "Invalid parameters provided.\nIf you believe this shouldn't have happened please contact us at contact@hacksoc.com"
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
        return res.render("pages/contact", { error: captchaMessage, recaptchaKey: process.env.G_RECAPTCHA_KEY });
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
      res.render('pages/signup', { recaptchaKey: process.env.G_RECAPTCHA_KEY });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.createSubscription = async (req, res, next) => {
    try {
      const { firstName, lastName, email, agreeToPrivacyPolicy, captchaMessage } = req.body;

      if (!firstName || !lastName || !email) {
        return res.render("pages/signup", { newsletterError: "Please fill in all fields!", selectedForm: "newsletter", recaptchaKey: process.env.G_RECAPTCHA_KEY });
      }
      if (!agreeToPrivacyPolicy) {
        return res.render("pages/signup", { newsletterError: "Please agree to the privacy policy.", selectedForm: "newsletter", recaptchaKey: process.env.G_RECAPTCHA_KEY });
      }
      if (captchaMessage) {
        return res.render("pages/signup", { newsletterError: captchaMessage, selectedForm: "newsletter", recaptchaKey: process.env.G_RECAPTCHA_KEY });
      }
      await subscriptionsService.createSubscriber(database, { firstName, lastName, email });
      return res.render("pages/message", { title: "Success", message: "Thank you for subscribing to our mailing list!" });
    } catch (err) {
      console.log(err);
      return res.render("pages/signup", { newsletterError: err, selectedForm: "newsletter", recaptchaKey: process.env.G_RECAPTCHA_KEY });
    }
  };

  this.getRemoveSubscription = async (req, res, next) => {
    try {
      const { email, subscriptionId } = req.query;

      if (!subscriptionId || !email) {
        return next({
          type: "message",
          title: "Error",
          message: "Invalid parameters provided.\nIf you believe this shouldn't have happened please contact us at contact@hacksoc.com"
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
          message: "Invalid parameters provided.\nIf you believe this shouldn't have happened please contact us at contact@hacksoc.com"
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
          message: "Invalid parameters provided.\nIf you believe this shouldn't have happened please contact us at contact@hacksoc.com"
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
          message: "Invalid parameters provided.\nIf you believe this shouldn't have happened please contact us at contact@hacksoc.com"
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

  this.committeeApply = async (req, res) => {
    try {
      const { firstName, lastName, email, subjectOfStudy, gender, teams, reasonToJoin, agreeToPrivacyPolicy, captchaMessage } = req.body;

      if (!firstName || !lastName || !email || !subjectOfStudy || !gender || !teams || !reasonToJoin) {
        return res.render("pages/signup", { committeeError: "Please fill in all fields!", selectedForm: "committee", recaptchaKey: process.env.G_RECAPTCHA_KEY });
      }
      if (!agreeToPrivacyPolicy) {
        return res.render("pages/signup", { committeeError: "Please agree to the privacy policy.", selectedForm: "committee", recaptchaKey: process.env.G_RECAPTCHA_KEY });
      }
      if (captchaMessage) {
        return res.render("pages/signup", { committeeError: captchaMessage, selectedForm: "committee", recaptchaKey: process.env.G_RECAPTCHA_KEY });
      }
      await dbHelpers.createCommitteeApplication(database, req.body);
      return res.render("pages/message", { title: "Success", message: "You have successfully applied to join our committee!\nWe will contact you as soon as a position becomes available." });
    } catch (err) {
      console.log(err);
      return res.render("pages/signup", { committeeError: err, selectedForm: "committee", recaptchaKey: process.env.G_RECAPTCHA_KEY });
    }
  };

  this.volunteerApply = async (req, res) => {
    try {
      const { firstName, lastName, email, subjectOfStudy, gender, teams, reasonToJoin, agreeToPrivacyPolicy, captchaMessage } = req.body;

      if (!firstName || !lastName || !email || !subjectOfStudy || !gender || !teams || !reasonToJoin) {
        return res.render("pages/signup", { volunteerError: "Please fill in all fields!", selectedForm: "volunteer", recaptchaKey: process.env.G_RECAPTCHA_KEY });
      }
      if (!agreeToPrivacyPolicy) {
        return res.render("pages/signup", { volunteerError: "Please agree to the privacy policy.", selectedForm: "volunteer", recaptchaKey: process.env.G_RECAPTCHA_KEY });
      }
      if (captchaMessage) {
        return res.render("pages/signup", { volunteerError: captchaMessage, selectedForm: "volunteer", recaptchaKey: process.env.G_RECAPTCHA_KEY });
      }
      await dbHelpers.createVolunteerApplication(database, req.body);
      return res.render("pages/message", { title: "Success", message: "You have successfully applied to volunteer!\nWe will contact you as soon as we need the help." });
    } catch (err) {
      console.log(err);
      return res.render("pages/signup", { volunteerError: err, selectedForm: "volunteer", recaptchaKey: process.env.G_RECAPTCHA_KEY });
    }
  };

  return this;
};
