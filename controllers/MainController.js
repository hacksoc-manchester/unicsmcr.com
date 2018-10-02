"use strict";

const teamService = require('../services/TeamService');
const partnersService = require('../services/PartnersService');
const galleryService = require('../services/GalleryService');
const emailService = require('../services/EmailService');
const eventsService = require('../services/EventsService');

const miscHelpers = require('../helpers/MiscHelpers');

module.exports = () => {
  this.index = async (req, res, next) => {
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
        return next(miscHelpers.invalidParamsResponse);
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

  this.privacy = (req, res, next) => {
    try {
      res.render("pages/privacy");
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.sponsors = (req, res, next) => {
    try {
      res.render("pages/sponsors");
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.getEvents = async (req, res, next) => {
    try {
      res.send(await eventsService.getEvents());
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  return this;
};
