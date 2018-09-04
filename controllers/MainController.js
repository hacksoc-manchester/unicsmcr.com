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

  this.cvLogin = (req, res) => {
    if (req.user) {
      return res.redirect("/cv/submission");
    }
    res.render("pages/cvBank/login", req.flash());
  };

  this.cvLogout = (req, res) => {
    req.logout();
    res.redirect("/cv/login");
  };

  this.cvRegister = (req, res) => {
    res.render("pages/cvBank/register");
  };

  this.cvPasswordRecovery = (req, res) => {
    res.render("pages/cvBank/passwordRecovery");
  };

  this.cvPasswordReset = (req, res) => {
    res.render("pages/cvBank/passwordReset");
  };

  this.cvSubmission = (req, res) => {
    res.render("pages/cvBank/submission", { user: req.user });
  };

  this.cvCreateSubmission = async (req, res) => {
    try {
      const { firstName, lastName, email, password, passwordConfirmation, agreeToPrivacyPolicy, captchaMessage } = req.body;

      // Checking if all parameters were provided
      if (!firstName || !lastName || !email || !password) {
        return res.render("pages/cvBank/register", { error: "Please fill in all fields!" });
      }
      if (password.length < 6) {
        return res.render("pages/cvBank/register", { error: "Your password must contain at least 6 characters!" });
      }
      if (password !== passwordConfirmation) {
        return res.render("pages/cvBank/register", { error: "The passwords do not match!" });
      }
      // Checking if user agreed to the privacy policy
      if (!agreeToPrivacyPolicy) {
        return res.render("pages/cvBank/register", { error: "Please agree to the privacy policy." });
      }
      // Checking if user passed the turing test
      if (captchaMessage) {
        return res.render("pages/cvBank/register", { error: captchaMessage });
      }
      // Creating application
      const submission = await dbHelpers.createCVSubmission(database, req.body);

      if (!submission) {
        throw new Error("Unkown error occured! Please contact us at contact@hacksoc.com");
      }
      emailService.sendCVBankEmailVerificationEmail(submission);
      return res.render("pages/message", { title: "Success", message: "You have succesfully registered to our CV bank!<br>You will shortly receive an email with a link to verify your email address.<br>You must verify your email address <b>before</b> logging into the CV Bank." });
    } catch (err) {
      console.log(err);
      return res.render("pages/cvBank/register", { error: err });
    }
  };

  this.cvEditSubmission = async (req, res) => {
    const { firstName, lastName, cvLink } = req.body;

    // Checking if all parameters were provided
    if (!firstName || !lastName || !cvLink) {
      return res.send({ err: "Please fill in all fields!" });
    }
    req.user.firstName = firstName;
    req.user.lastName = lastName;
    req.user.cvLink = cvLink;
    await dbHelpers.updateCVSubmission(database, req.user);
    res.send({ err: false });
  };

  this.cvVerifySubmission = async (req, res, next) => {
    console.log(req.query);
    const { email, emailToken } = req.query;

    // Checking if all parameters were provided
    if (!email || !emailToken) {
      return next();
    }
    const updateResponse = await dbHelpers.verifyCVSubmission(database, req.query);

    if (updateResponse == 0) { // The required cv submission could not be found
      return next({
        type: "message",
        title: "Error",
        message: "Invalid parameters provided.<br>If you believe this shouldn't have happened please contact us at contact@hacksoc.com"
      });
    }
    res.render("pages/message", { title: "Success", message: "You have successfully verified your email for your CV Bank account<br>You can now <a href='/cv/login'>login</a>." });
  };

  this.cvPublishSubmission = async (req, res) => {
    if (!req.user.cvLink) {
      return res.send({ err: true, message: `Please provide a link to your CV before publishing you submission!` });
    }
    await dbHelpers.publishCVSubmission(database, req.user);
    req.user.submissionStatus = !req.user.submissionStatus;
    res.send({ err: false, message: `Your submission has been successfully made ${req.user.submissionStatus ? 'public' : 'private'}!`, submissionStatus: req.user.submissionStatus });
  };

  return this;
};
