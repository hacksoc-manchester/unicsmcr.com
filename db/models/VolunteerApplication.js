"use strict";

module.exports = function(sequelize, DataTypes) {

  const VolunteerApplication = sequelize.define("volunteerapplication", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    subjectOfStudy: DataTypes.STRING,
    yearOfStudy: DataTypes.STRING,
    gender: DataTypes.STRING,
    teams: DataTypes.STRING,
    reasonToJoin: DataTypes.STRING,
    onlyAvailableAtEvent: DataTypes.BOOLEAN
  });

  return VolunteerApplication;
};
