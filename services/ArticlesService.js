"use strict";

const dbHelpers = require("../helpers/DbHelpers");

// Gets all articles in the database
exports.getArticles = async database => {
  try {
    return await dbHelpers.getArticles(database);
  } catch (err) {
    throw new Error("Failed to get articles");
  }
};

// Creates an article in the database
exports.createArticle = async (database, { title, content, date, photoLink }) => {
  return await dbHelpers.createJobPosting(database, {
    title,
    content,
    date,
    photoLink
  });
};
