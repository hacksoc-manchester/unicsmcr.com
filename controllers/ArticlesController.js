"use strict";

const articlesService = require("../services/ArticlesService");

module.exports = database => {
  // renders the articles page
  this.index = async (req, res, next) => {
    try {
      const allArticles = await articlesService.getArticles(database);

      res.render("pages/articles", { articles: allArticles });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  };

  // creates a new article
  this.addArticle = async (req, res) => {
    try {
      const { title, content, photoLink, date } = req.body;

      if (!title || !content || !photoLink || date) {
        throw new Error(
          "Please provide the following data: title, content, photoLink"
        );
      }
      if (content.length > 10000) {
        throw new Error(
          "The article should not be longer than 10000 characters."
        );
      }
      res.send(await articlesService.createArticle(database, req.body));
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  };

  return this;
};
