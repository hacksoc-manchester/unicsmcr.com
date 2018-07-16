"use strict";

exports.MakeRandomString = (length) => {
  return Math.random().toString(36).slice(2, length) + Math.random().toString(36).slice(2, length);
};
