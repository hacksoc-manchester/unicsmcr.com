"use strict";

const express = require('express');

const mainController = require('../controllers/MainController');

const router = express.Router();

router.get('/', mainController.index);

module.exports = router;
