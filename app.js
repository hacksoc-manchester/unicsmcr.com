"use strict";

require('dotenv').load();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('req-flash');

const errorController = require('./controllers/ErrorController');
const mainRouter = require('./routes/MainRouter');
const dbConnection = require('./db/Sequelize');

const port = process.env.PORT || 5000;
const app = express();
const database = dbConnection.init();

database.sync();
const passport = require('./helpers/AuthStrategy')(database);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/static')));
app.use(morgan(process.env.ENVIRONMENT));

// Setting up sessions middleware
const sess = {
  secret: process.env.SESSIONS_SECRET,
  cookie: {}
};

if (process.env.ENVIRONMENT === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

if (process.env.ENVIRONMENT == "dev") { // Disable cache in development environment
  app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
}

app.use('/', mainRouter(database, passport));

app.use(errorController.handle404); // 404 Handler
app.use(errorController.handleOther); // Error handler for expected errors
app.use(errorController.handle500); // Error handler for unexpected errors


const server = app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

module.exports = server;
