"use strict";

const fs = require('fs');

// Returns the list of all members of the current team
exports.getCurrentTeam = () => {
  const team = JSON.parse(fs.readFileSync('./externalData/team.json', 'utf8'));

  return team;
};

// Retruns the list of memebers in the Hall of Fame
exports.getHallOfFame = () => {
  const hallOfFame = JSON.parse(fs.readFileSync('./externalData/hallOfFame.json', 'utf8'));

  return hallOfFame;
};
