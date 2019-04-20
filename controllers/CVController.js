"use strict";

const emailService = require('../services/EmailService');

const dbHelpers = require('../helpers/DbHelpers');
const miscHelpers = require('../helpers/MiscHelpers');

module.exports = (database) => {
  this.login = (req, res) => {
    if (req.user) {
      return res.redirect("/cv/submission/");
    }
    res.render("pages/cvBank/login", req.flash());
  };

  this.logout = (req, res) => {
    req.logout();
    res.redirect("/cv/login/");
  };

  this.register = (req, res) => {
    res.render("pages/cvBank/register");
  };

  this.passwordReset = (req, res) => {
    res.render("pages/cvBank/passwordResetRequest");
  };

  this.submissionPasswordResetPage = async (req, res, next) => {
    const { email, emailToken } = req.query;

    // Checking if all parameters were provided
    if (!email || !emailToken) {
      return next(miscHelpers.invalidParamsResponse);
    }

    const submission = await dbHelpers.findCVSubmissionByEmailAndToken(database, req.query.email, req.query.emailToken);

    if (!submission) {
      return next(miscHelpers.invalidParamsResponse);
    }
    res.render("pages/cvBank/passwordReset", { email, emailToken });
  };

  this.submissionPasswordReset = async (req, res, next) => {
    const { email, emailToken, password, passwordConfirmation } = req.body;

    // Checking if all parameters were provided
    if (!email || !emailToken || !password || !passwordConfirmation) {
      return res.render("pages/cvBank/passwordReset", { email, emailToken, error: "Please fill in all fields!" });
    }
    if (password != passwordConfirmation) {
      return res.render("pages/cvBank/passwordReset", { email, emailToken, error: "Provided passwords don't match!" });
    }

    const updateResponse = await dbHelpers.resetPasswordForCVSubmission(database, email, emailToken, password);

    if (updateResponse == 0) {
      return next(miscHelpers.invalidParamsResponse);
    }

    res.render("pages/message", { title: "Success", message: `Password for ${email} has been reset.<br>You can now login <a href="/cv/login">here</a>` });
  };

  this.requestPasswordReset = async (req, res) => {
    const email = req.body.email;

    if (!email) {
      res.render("pages/cvBank/passwordResetRequest", { error: "Please fill in all fields!", recaptchaKey: process.env.G_RECAPTCHA_KEY });
    }
    const submission = await dbHelpers.findCVSubmissionByEmail(database, email);

    if (!submission) {
      res.render("pages/cvBank/passwordResetRequest", { error: "Given email is not on our CV Bank!", recaptchaKey: process.env.G_RECAPTCHA_KEY });
    }
    emailService.sendCVBankPasswordResetEmail(submission);
    res.render("pages/message", { title: "Success", message: `Further instructions have been sent to ${email}` });
  };

  this.submission = (req, res) => {
    res.render("pages/cvBank/submission", { user: req.user });
  };

  this.createSubmission = async (req, res) => {
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
        throw new Error("Unkown error occured! Please contact us at contact@unicsmcr.com");
      }
      emailService.sendCVBankEmailVerificationEmail(submission);
      return res.render("pages/message", { title: "Success", message: "You have succesfully registered to our CV bank!<br>You will shortly receive an email with a link to verify your email address.<br>You must verify your email address <b>before</b> logging into the CV Bank." });
    } catch (err) {
      console.log(err);
      return res.render("pages/cvBank/register", { error: err });
    }
  };

  this.editSubmission = async (req, res, next) => {
    const { firstName, lastName, cvLink, github, linkedIn } = req.body;

    // Checking if all parameters were provided
    if (!firstName || !lastName || !cvLink) {
      return res.send({ err: "Please fill in all required fields!" });
    }
    const updateResponse = await dbHelpers.updateCVSubmission(database, req.user, { firstName, lastName, cvLink, github, linkedIn });

    if (updateResponse == 0) {
      return next(miscHelpers.invalidParamsResponse);
    }
    res.send({ err: false });
  };

  this.verifySubmission = async (req, res, next) => {
    const { email, emailToken } = req.query;

    // Checking if all parameters were provided
    if (!email || !emailToken) {
      return next(miscHelpers.invalidParamsResponse);
    }
    const updateResponse = await dbHelpers.verifyCVSubmission(database, req.query);

    if (updateResponse == 0) { // The required cv submission could not be found
      return next(miscHelpers.invalidParamsResponse);
    }
    res.render("pages/message", { title: "Success", message: "You have successfully verified your email for your CV Bank account<br>You can now <a href='/cv/login'>login</a>." });
  };

  this.publishSubmission = async (req, res) => {
    if (!req.user.cvLink) {
      return res.send({ err: true, message: `Please provide a link to your CV before publishing you submission!` });
    }
    await dbHelpers.publishCVSubmission(database, req.user);
    req.user.submissionStatus = !req.user.submissionStatus;
    res.send({ err: false, message: `Your submission has been successfully made ${req.user.submissionStatus ? 'public. It will now be sent out to our sponsors' : 'private'}!`, submissionStatus: req.user.submissionStatus });
  };

  return this;
};
