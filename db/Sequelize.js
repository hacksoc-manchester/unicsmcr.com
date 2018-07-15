"use strict";

const Sequelize = require('sequelize');

module.exports.init = () => {

  // Database connection
  const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: process.env.DB_DIALECT,
      pool: {
        max: 8,
        min: 0,
        idle: 10000
      },
      host: process.env.DB_HOST,
      logging: false
    }
  );

  // load database schema
  const schema = require("./Schema");
  var models = schema(sequelize, Sequelize);

  models.sequelize = sequelize;
  return models;
};
