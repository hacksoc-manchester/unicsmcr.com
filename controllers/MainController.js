"use strict";

const teamService = require('../services/TeamService');
const partnersService = require('../services/PartnersService');
const galleryService = require('../services/GalleryService');
const contactService = require('../services/ContactService');

exports.index = (req, res) => {
  res.render('pages/index');
};

exports.contact = (req, res) => {
  res.render('pages/contact', { recaptchaKey: process.env.G_RECAPTCHA_KEY });
};

exports.contactSendMessage = (req, res) => {
  const { name, email, message } = req.body;
  const sender = `${name || "Name not specified"}: ${email || "Email not specified"}`;

  contactService.sendEmail(sender, message);
  res.send("ok");
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
      return res.send(err);
    }
    res.render('pages/gallery', { galleries });
  });
};
