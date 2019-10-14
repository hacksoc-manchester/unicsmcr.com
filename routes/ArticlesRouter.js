"use strict";

const express = require("express");

const ArticlesRouter = database => {
  const router = express.Router();

  const articlesController = require("../controllers/ArticlesController")(
    database
  );

  router.get("/", articlesController.index);

  router.post("/create", articlesController.addArticle);

  return router;
};

module.exports = ArticlesRouter;
