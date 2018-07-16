"use strict";

module.exports = function(sequelize, DataTypes) {

  const SubscriptionRequest = sequelize.define("subscriptionrequest", {
    subscriptionId: DataTypes.STRING,
    subscriberEmail: DataTypes.STRING
  });

  return SubscriptionRequest;
};
