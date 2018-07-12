"use strict";

const teamService = require('../services/TeamService');
const partnersService = require('../services/PartnersService');
const galleryService = require('../services/GalleryService');
const emailService = require('../services/EmailService');

exports.index = (req, res) => {
  res.render('pages/index');
};

exports.contact = (req, res) => {
  res.render('pages/contact', { recaptchaKey: process.env.G_RECAPTCHA_KEY });
};

exports.contactHackSoc = (req, res) => {
  const { name, email, message } = req.body;
  const sender = `${name || "Name not specified"}: ${email || "Email not specified"}`;

  emailService.sendEmail(sender, message);
  res.render('pages/message', { title: 'Contact', message: "Thank you! Your message has been received." });
};

exports.team = (req, res) => {
  res.render('pages/team', {
    team: teamService.getCurrentTeam(),
    hallOfFame: teamService.getHallOfFame()
  });
};

exports.partners = (req, res) => {
  res.render('pages/partners', { partners: partnersService.getPartners() });
};

exports.gallery = (req, res) => {
  galleryService.getGalleries((err, galleries) => {
    if (err) {
      console.log(err);
      return res.render('pages/message', { title: "Gallery", message: "Could not load the gallery. Sorry!" });
    }
    res.render('pages/gallery', { galleries });
  });
};
