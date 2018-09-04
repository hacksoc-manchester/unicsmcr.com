"use strict";

module.exports = function(sequelize, DataTypes) {

  const CVSubmission = sequelize.define("cvsubmission", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    emailToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cvLink: DataTypes.STRING,
    submissionStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }
  });

  return CVSubmission;
};
