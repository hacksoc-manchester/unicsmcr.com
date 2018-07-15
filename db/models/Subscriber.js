"use strict";

module.exports = function(sequelize, DataTypes) {

  const Subscriber = sequelize.define("subscriber", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    subscriptionId: DataTypes.STRING
  });

  return Subscriber;
};
