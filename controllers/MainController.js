"use strict";

const teamService = require('../services/TeamService');

exports.index = (req, res) => {
  res.render('pages/index');
};

exports.contact = (req, res) => {
  res.render('pages/contact');
};

exports.team = (req, res) => {
  res.render('pages/team', {
    team: teamService.getCurrentTeam(),
    hallOfFame: teamService.getHallOfFame()
  });
};
 