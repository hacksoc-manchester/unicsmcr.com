"use strict";

const jobsService = require('../services/JobsService');

module.exports = (database) => {
  this.index = async (req, res, next) => {
    try {
      res.send(await jobsService.getJobs(database));
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.createPosting = async (req, res) => {
    try {
      const { position, description, company, location, applyLink, apiKey } = req.body;

      if (apiKey != process.env.JOBS_API_KEY) {
        throw new Error("Unrecognized API key");
      }
      if (!position || !description || !company || !location || !applyLink) {
        throw new Error("Please provide the following data: position, description, company, location, applyLink");
      }
      res.send(await jobsService.createJob(database, req.body));
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  };

  return this;
};
