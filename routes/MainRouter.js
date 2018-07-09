"use strict";

const express = require('express');

const mainController = require('../controllers/MainController');

const router = express.Router();

// Home Page
router.get('/', mainController.index);
// Contact Page
router.get('/contact', mainController.contact);


module.exports = router;
