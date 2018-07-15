"use strict";

module.exports = function(sequelize, DataTypes) {
  const Subscriber = require("./models/Subscriber")(sequelize, DataTypes);

  return {
    Subscriber
  };
};
