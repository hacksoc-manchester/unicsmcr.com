"use strict";

const errorController = require('./ErrorController');

const teamService = require('../services/TeamService');
const partnersService = require('../services/PartnersService');
const galleryService = require('../services/GalleryService');
const emailService = require('../services/EmailService');
const subscriptionsService = require('../services/SubscribtionsService');


module.exports = (database) => {
  this.index = (req, res) => {
    res.render('pages/index');
  };

  this.contact = (req, res) => {
    res.render('pages/contact', { recaptchaKey: process.env.G_RECAPTCHA_KEY });
  };

  this.message = (req, res) => {
    const { title, message } = req.query;

    if (!title || !message) {
      return errorController.handle404(req, res);
    }
    return res.render('pages/message', { title, message });
  };

  this.contactHackSoc = (req, res) => {
    const { name, email, message } = req.body;
    const sender = `${name || "Name not specified"}: ${email || "Email not specified"}`;

    emailService.contactHackSoc(sender, message);
    res.render('pages/message', { title: 'Contact', message: "Thank you! Your message has been received." });
  };

  this.team = (req, res) => {
    res.render('pages/team', {
      team: teamService.getCurrentTeam(),
      hallOfFame: teamService.getHallOfFame()
    });
  };

  this.partners = (req, res) => {
    res.render('pages/partners', { partners: partnersService.getPartners() });
  };

  this.gallery = (req, res) => {
    galleryService.getGalleries((err, galleries) => {
      if (err) {
        console.log(err);
        return res.render('pages/message', { title: "Gallery", message: "Could not load the gallery. Sorry!" });
      }
      res.render('pages/gallery', { galleries });
    });
  };

  this.createSubscription = (req, res) => {
    const { firstName, lastName, email } = req.query;

    if (!firstName || !lastName || !email) {
      return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Error&message=Invalid parameters provided. Please try again`);
    }
    subscriptionsService.createSubscriber(database, { firstName, lastName, email }).then(data => {
      if (data.err) {
        return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Error&message=${data.message}`);
      }
      return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Success&message=Thank you for subscribing to our mailing list!`);
    });
  };

  this.removeSubscription = (req, res) => {
    const { email, subscriptionId } = req.query;

    if (!subscriptionId || !email) {
      return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Error&message=Invalid parameters provided. Please try again`);
    }
    subscriptionsService.removeSubscriber(database, { email, subscriptionId }).then(() => {
      return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Success&message=Your subscription has been removed successfully!`);
    }).catch(() => {
      errorController.handle500(req, res);
    });
  };

  this.confirmSubscription = async (req, res) => {
    const { firstName, lastName, email, subscriptionId } = req.query;

    if (!firstName || !lastName || !email || !subscriptionId) {
      return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Error&message=Invalid parameters provided. Please try again`);
    }

    const confirmation = await subscriptionsService.confirmSubscription(database, {
      firstName,
      lastName,
      email,
      subscriptionId
    });

    if (confirmation.err) {
      console.log(confirmation.message);
      return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Error&message=Invalid parameters provided. Please try again`);
    }
    return res.redirect(`${req.protocol}://${req.get('host')}/message?title=Success&message=Thank you for subscribing to our mailing list!`);
  };

  this.listSubscriptions = async (req, res) => {
    const subscribers = await subscriptionsService.subscribersList(database);

    res.send(subscribers);
  };

  return this;
};
