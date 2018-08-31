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

database.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/static')));
app.use(morgan(process.env.ENVIRONMENT));

// middleware to parse the requests
app.use(express.json());
app.use(express.urlencoded());

if (process.env.ENVIRONMENT == "dev") { // Disable cache in development environment
  app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
}

app.use('/', mainRouter(database));

app.use(errorController.handle404); // 404 Handler
app.use(errorController.handleOther); // Error handler for expected errors
app.use(errorController.handle500); // Error handler for unexpected errors


const server = app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

module.exports = server;
