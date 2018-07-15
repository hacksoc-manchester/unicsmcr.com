"use strict";

require('dotenv').load();
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const errorController = require('./controllers/ErrorController');
const mainRouter = require('./routes/MainRouter');
const dbConnection = require('./db/Sequelize');

const port = process.env.PORT || 5000;
const app = express();
const database = dbConnection.init();

// Syncing database with current database schema
database.sequelize.sync().then(() => {
  database.Subscriber.destroy({
    where: {
      email: 'kzalys@gmail.com'
    }
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/static')));
app.use(morgan(process.env.ENVIRONMENT));

app.use('/', mainRouter(database));

if (process.env.ENVIRONMENT == "dev") { // Disable cache in development environment
  app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
}

app.use(errorController.handle500);
app.use(errorController.handle404);

app.listen(port);
console.log("App started on port: " + port);
