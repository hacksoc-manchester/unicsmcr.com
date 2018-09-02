"use strict";

// REVIEW: needs renaming
exports.handleOther = (err, req, res, next) => {
  if (err.type !== "message") {
    return next(err);
  }
  console.error(err);
  res.status(500).render('pages/message', { title: err.title, message: err.message, showContact: true });
};

exports.handle500 = (err, req, res, next) => {
  console.error(err);
  res.status(500).render('pages/message', { title: "Error", message: "There seems to be a problem with the server. Sorry!", showContact: true });
};

exports.handle404 = (req, res, next) => {
  res.status(404).render('pages/message', { title: "Error", message: "There's nothing here. Sorry!", showContact: true });
};
