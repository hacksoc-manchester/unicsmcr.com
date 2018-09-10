"use strict";

const jobsService = require('../services/JobsService');

module.exports = (database) => {
  this.index = async (req, res, next) => {
    try {
      const jobs = await jobsService.getJobs(database);

      res.render("pages/jobs", { jobs });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  this.createPosting = async (req, res) => {
    try {
      const { position, description, company, location, applyLink, logoLink, apiKey } = req.body;

      if (apiKey != process.env.JOBS_API_KEY) {
        throw new Error("Unrecognized API key");
      }
      if (!position || !description || !company || !location || !applyLink || !logoLink) {
        throw new Error("Please provide the following data: position, description, company, location, applyLink, logoLink");
      }
      if (description.length > 4000) {
        throw new Error("The description should not be longer than 4000 characters.");
      }
      res.send(await jobsService.createJob(database, req.body));
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  };

  return this;
};
