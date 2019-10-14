"use strict";

const dbHelpers = require("../helpers/DbHelpers");

// Gets all articles in the database
exports.getArticles = async database => {
  return await dbHelpers.getArticles(database);
};

// Creates an article in the database
exports.createArticle = async (database, { title, content, photoLink }) => {
  return await dbHelpers.createJobPosting(database, {
    title,
    content,
    date,
    photoLink
  });
};
