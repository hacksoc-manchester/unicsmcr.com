"use strict";

module.exports = function(sequelize, DataTypes) {
  const Subscriber = require("./models/Subscriber")(sequelize, DataTypes);
  const SubscriptionRequest = require("./models/SubscriptionRequest")(sequelize, DataTypes);

  return {
    Subscriber,
    SubscriptionRequest
  };
};
