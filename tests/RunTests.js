"use strict";
/* jslint strict:false */
/* jshint expr:true */

require('dotenv').load();
const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const app = require('../app');

chai.use(chaiHttp);

// unhandled rejection detection -----------------------------------------------
process.on("unhandledRejection", (reason, p) => {
  console.log("Possibly Unhandled Rejection at: Promise ");
  console.log(p);
  console.log(" reason: ", reason);
});

require('./LoadTests')(mocha, app);
require('./DbTests')(mocha);
require('./SubscriptionTests')(mocha, app);
require('./CVBankTests')(mocha, app);
require('./JobsTests')(mocha, app);
