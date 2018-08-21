"use strict";

const teamService = require('../services/TeamService');
const partnersService = require('../services/PartnersService');
const galleryService = require('../services/GalleryService');
const emailService = require('../services/EmailService');
const subscriptionsService = require('../services/SubscriptionsService');


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
      const { name, email, message } = req.body;
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
      res.render('pages/sign-up');
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.createSubscription = (req, res, next) => {
    try {
      const { firstName, lastName, email } = req.query;

      if (!firstName || !lastName || !email) {
        return next({
          type: "message",
          title: "Error",
          message: "Invalid parameters provided.\nIf you believe this shouldn't have happened please contact us at contact@hacksoc.com"
        });
      }
      subscriptionsService.createSubscriber(database, { firstName, lastName, email }).then(() => {
        return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Success&message=Thank you for subscribing to our mailing list!`);
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.removeSubscription = (req, res, next) => {
    try {
      const { email, subscriptionId } = req.query;

      if (!subscriptionId || !email) {
        return next({
          type: "message",
          title: "Error",
          message: "Invalid parameters provided.\nIf you believe this shouldn't have happened please contact us at contact@hacksoc.com"
        });
      }
      subscriptionsService.removeSubscriber(database, { email, subscriptionId }).then(() => {
        return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Success&message=Your subscription has been removed successfully!`);
      });
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

      return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Success&message=Thank you for subscribing to our mailing list!`);
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

  return this;
};
