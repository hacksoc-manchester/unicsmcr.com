"use strict";

const fs = require('fs');

exports.getPartners = () => {
  const partners = JSON.parse(fs.readFileSync('./jsonData/sponsors.json', 'utf8'));

  return partners;
};
