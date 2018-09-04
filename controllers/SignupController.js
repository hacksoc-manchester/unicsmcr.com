"use strict";

const subscriptionsService = require('../services/SubscriptionsService');

const dbHelpers = require('../helpers/DbHelpers');
const miscHelpers = require('../helpers/MiscHelpers');

module.exports = (database) => {
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

  this.removeSubscription = async (req, res, next) => {
    try {
      let { email, subscriptionId } = req.query; // Params in get request

      if (!subscriptionId || !email) {
        // TODO: test out
        ({ email, subscriptionId } = req.body); // Params in delete request
        if (!subscriptionId || !email) {
          return next(miscHelpers.invalidParamsResponse);
        }
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
        return next(miscHelpers.invalidParamsResponse);
      }

      try {
        await subscriptionsService.confirmSubscription(database, {
          firstName,
          lastName,
          email,
          subscriptionId
        });
      } catch (err) {
        return next(miscHelpers.invalidParamsResponse);
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

  // Creates an application to the committee
  this.committeeApply = async (req, res) => {
    try {
      const { firstName, lastName, email, subjectOfStudy, gender, teams, reasonToJoin, agreeToPrivacyPolicy, captchaMessage } = req.body;

      // Checking if all parameters were provided
      if (!firstName || !lastName || !email || !subjectOfStudy || !gender || !teams || !reasonToJoin) {
        return res.render("pages/signup", { committeeError: "Please fill in all fields!", selectedForm: "committee" });
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
      const { firstName, lastName, email, subjectOfStudy, gender, teams, reasonToJoin, agreeToPrivacyPolicy, captchaMessage } = req.body;

      // Checking if all parameters were provided
      if (!firstName || !lastName || !email || !subjectOfStudy || !gender || !teams || !reasonToJoin) {
        return res.render("pages/signup", { volunteerError: "Please fill in all fields!", selectedForm: "volunteer" });
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
