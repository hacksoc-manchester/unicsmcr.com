"use strict";

const express = require('express');

const CVRouter = (database) => {
  const router = express.Router();

  const jobsController = require("../controllers/JobsControler")(database);

  router.get('/', jobsController.index);

  router.post('/create', jobsController.createPosting);

  return router;
};


module.exports = CVRouter;
