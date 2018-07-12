"use strict";

exports.handle500 = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).render('pages/message', { title: "Error", message: "There seems to be a problem with the server. Sorry!" });
};
exports.handle404 = (req, res) => {
  res.status(404).render('pages/message', { title: "Error", message: "There's nothing here. Sorry!" });
};
