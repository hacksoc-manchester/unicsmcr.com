"use strict";

const dbHelpers = require("../helpers/DbHelpers");

exports.getJobs = async (database) => {
  return await dbHelpers.getJobs(database);
};

exports.createJob = async (database, { position, description, company, location, applyLink, logoLink }) => {
  return await dbHelpers.createJobPosting(database, { position, description, company, location, applyLink, logoLink });
};
