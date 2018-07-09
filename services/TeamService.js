"use strict";

const fs = require('fs');

exports.getCurrentTeam = () => {
  const team = JSON.parse(fs.readFileSync('./jsonData/team.json', 'utf8'));

  return team;
};

exports.getHallOfFame = () => {
  const hallOfFame = JSON.parse(fs.readFileSync('./jsonData/hallOfFame.json', 'utf8'));

  return hallOfFame;
};
