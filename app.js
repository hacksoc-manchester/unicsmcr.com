"use strict";

require('dotenv').load();
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const mainRouter = require('./routes/MainRouter');

const port = process.env.PORT || 5000;
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/static')));
app.use(morgan(process.env.ENVIRONMENT));

app.use('/', mainRouter);

if (process.env.ENVIRONMENT == "dev") { // Disable cache in development environment
  app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
}

// TODO: handle 404 errors

app.listen(port);
console.log("App started on port: " + port);
