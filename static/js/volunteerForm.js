/* globals $ */
'use strict';

// The maximum length of the input in the reson to join textarea
var reasonToJoinMaxLength = 256;

// Gender selectors (HTML elements)
var volunteerGenderSelectors = {
  male: "#volunteer-male-gender-selector",
  female: "#volunteer-female-gender-selector",
  other: "#volunteer-other-gender-selector"
};

// Team selectors (HTML elements)
var volunteerTeamSelectors = {
  enterntainment: "#volunteer-enterntainment-team-selector",
  events: "#volunteer-events-team-selector",
  dev: "#volunteer-dev-team-selector",
  graphics: "#volunteer-graphics-team-selector",
  pr: "#volunteer-pr-team-selector"
};

// Changes the selected gender
function volunteerChooseGender(gender) {
  // Switching the selected gender selector
  $(".selected-gender-button").removeClass("selected-gender-button");
  $(volunteerGenderSelectors[gender]).addClass("selected-gender-button");
  // Updating the selected gender
  if (gender == "other") {
    // Showing the gender input field for other gender
    $("#volunteer-gender-input").val("");
    $("#volunteer-gender-input").fadeIn("fast");
  } else {
    // Hiding the gender input field for other gender
    $("#volunteer-gender-input").fadeOut("fast", function() {
      $("#volunteer-gender-input").val(gender);
    });
  }
}

// Limits the length of the reason to join to reasonToJoinMaxLength
function volunteerUpdateReasonToJoin() {
  var reason = $("#volunteer-reason-textarea").val();

  if (reason.length > reasonToJoinMaxLength) {
    reason = reason.slice(0, reasonToJoinMaxLength);
  }
  $("#volunteer-reason-textarea").val(reason);
}

// Selects or deselects a team
function volunteerSelectTeam(team) {
  // Fetching the already selected teams
  var selectedTeams = $("#volunteer-teams-input").val();
  var teamIndex = selectedTeams.indexOf(team);

  if (teamIndex >= 0) {
    // Given team is selected, deselecting it
    $(volunteerTeamSelectors[team]).removeClass("selected-team-button");
    selectedTeams = selectedTeams.replace((teamIndex > 1 ? "," : " ") + team, "");
  } else {
    // Given team is not selected, selecting it
    $(volunteerTeamSelectors[team]).addClass("selected-team-button");
    selectedTeams += (selectedTeams.length > 0 ? "," : " ") + team;
  }
  // Updating the selected teams
  $("#volunteer-teams-input").val(selectedTeams);
}
