"use strict";

const jobsService = require('../services/JobsService');

module.exports = (database) => {
  // Renders the jobs posting page
  this.index = async (req, res, next) => {
    try {
      const jobs = await jobsService.getJobs(database);
      let companies = [];

      // Fetching the unique names of all companies in the jobs
      jobs.forEach(job => {
        if (!companies.find(c => c == job.company)) {
          companies.push(job.company);
        }
      });
      // Sorting companies alphabetically
      companies = companies.sort((a, b) => a > b);

      res.render("pages/jobs", { jobs, companies });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  // Creates a new job listing
  this.createPosting = async (req, res) => {
    try {
      const { position, description, company, location, applyLink, logoLink, apiKey } = req.body;

      if (apiKey != process.env.JOBS_API_KEY) {
        throw new Error("Unrecognized API key");
      }
      if (!position || !description || !company || !location || !applyLink || !logoLink) {
        throw new Error("Please provide the following data: position, description, company, location, applyLink, logoLink");
      }
      if (description.length > 10000) {
        throw new Error("The description should not be longer than 10000 characters.");
      }
      res.send(await jobsService.createJob(database, req.body));
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  };

  return this;
};
