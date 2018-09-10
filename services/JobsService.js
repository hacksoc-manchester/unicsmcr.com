"use strict";

const dbHelpers = require("../helpers/DbHelpers");

// Gets all jobs in the database
exports.getJobs = async (database) => {
  return await dbHelpers.getJobs(database);
};

// Creates a job in the database
exports.createJob = async (database, { position, description, company, location, applyLink, logoLink }) => {
  return await dbHelpers.createJobPosting(database, { position, description, company, location, applyLink, logoLink });
};
