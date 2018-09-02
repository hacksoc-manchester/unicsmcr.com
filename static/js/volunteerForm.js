/* globals $ */
'use strict';

var reasonToJoinMaxLength = 256;

var volunteerGenderSelectors = {
  male: "#volunteer-male-gender-selector",
  female: "#volunteer-female-gender-selector",
  other: "#volunteer-other-gender-selector"
};

var volunteerTeamSelectors = {
  enterntainment: "#volunteer-enterntainment-team-selector",
  events: "#volunteer-events-team-selector",
  dev: "#volunteer-dev-team-selector",
  graphics: "#volunteer-graphics-team-selector",
  pr: "#volunteer-pr-team-selector"
};

function volunteerChooseGender(gender) {
  $(".selected-gender-button").removeClass("selected-gender-button");
  $(volunteerGenderSelectors[gender]).addClass("selected-gender-button");
  if (gender == "other") {
    $("#volunteer-gender-input").val($("#volunteer-other-gender-input").val());
    $("#volunteer-other-gender-input").val("");
    $("#volunteer-other-gender-input").fadeIn("fast");
  } else {
    $("#volunteer-other-gender-input").fadeOut("fast", function() {
      $("#volunteer-other-gender-input").val(gender);
    });
    $("#volunteer-gender-input").val(gender);
  }
}

function volunteerUpdateReasonToJoin() {
  var reason = $("#volunteer-reason-textarea").val();

  if (reason.length > reasonToJoinMaxLength) {
    reason = reason.slice(0, reasonToJoinMaxLength);
  }
  $("#volunteer-reason-textarea").val(reason);
}

function volunteerSelectTeam(team) {
  var selectedTeams = $("#volunteer-teams-input").val();
  var teamIndex = selectedTeams.indexOf(team);

  if (teamIndex >= 0) {
    $(volunteerTeamSelectors[team]).removeClass("selected-team-button");
    selectedTeams = selectedTeams.replace((teamIndex > 1 ? "," : " ") + team, "");
  } else {
    $(volunteerTeamSelectors[team]).addClass("selected-team-button");
    selectedTeams += (selectedTeams.length > 0 ? "," : " ") + team;
  }
  $("#volunteer-teams-input").val(selectedTeams);
}
