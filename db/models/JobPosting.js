"use strict";

module.exports = function(sequelize, DataTypes) {

  const JobPosting = sequelize.define("jobposting", {
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(10000),
      allowNull: false
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    applyLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logoLink: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return JobPosting;
};
