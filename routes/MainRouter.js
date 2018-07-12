"use strict";

const express = require('express');

const mainController = require('../controllers/MainController');
const authHelpers = require('../helpers/AuthHelpers');

const router = express.Router();

// Home Page
router.get('/', mainController.index);
// Contact Page
router.get('/contact', mainController.contact);
// Contact Page
router.post('/contact', authHelpers.verifyReCAPTCHA, mainController.contactHackSoc); // TODO: enable reCAPTCHA verification
// Team Page
router.get('/team', mainController.team);
// Partners Page
router.get('/partners', mainController.partners);
// Gallery Page
router.get('/gallery', mainController.gallery);


module.exports = router;
