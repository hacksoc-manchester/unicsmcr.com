"use strict";

module.exports = function(sequelize, DataTypes) {
  const ArticlePosting = sequelize.define("articleposting", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(10000),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    photoLink: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return ArticlePosting;
};
