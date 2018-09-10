"use strict";

module.exports = function(sequelize, DataTypes) {
  const Subscriber = require("./models/Subscriber")(sequelize, DataTypes);
  const SubscriptionRequest = require("./models/SubscriptionRequest")(sequelize, DataTypes);
  const CommitteeApplication = require("./models/CommitteeApplication")(sequelize, DataTypes);
  const VolunteerApplication = require("./models/VolunteerApplication")(sequelize, DataTypes);
  const CVSubmission = require("./models/CVSubmission")(sequelize, DataTypes);
  const JobPosting = require("./models/JobPosting")(sequelize, DataTypes);

  return {
    Subscriber,
    SubscriptionRequest,
    CommitteeApplication,
    VolunteerApplication,
    CVSubmission,
    JobPosting
  };
};
