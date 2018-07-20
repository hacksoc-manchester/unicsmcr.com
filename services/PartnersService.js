"use strict";

const fs = require('fs');

// Reads the partners file and returns a list of all partners
exports.getPartners = () => {
  const partners = JSON.parse(fs.readFileSync('./jsonData/sponsors.json', 'utf8'));

  return partners;
};
