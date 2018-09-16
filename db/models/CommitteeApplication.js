"use strict";

module.exports = function(sequelize, DataTypes) {

  const CommitteeApplication = sequelize.define("committeeapplication", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    subjectOfStudy: DataTypes.STRING,
    yearOfStudy: DataTypes.STRING,
    gender: DataTypes.STRING,
    teams: DataTypes.STRING,
    reasonToJoin: DataTypes.STRING
  });

  return CommitteeApplication;
};
