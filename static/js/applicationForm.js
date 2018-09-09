/* globals $ */
'use strict';

// The maximum length of the input in the reson to join textarea
var reasonToJoinMaxLength = 256;

// Gender selectors (HTML elements)
var genderSelectors = {
  male: "#male-gender-selector",
  female: "#female-gender-selector",
  other: "#other-gender-selector"
};

// Team selectors (HTML elements)
var teamSelectors = {
  enterntainment: "#enterntainment-team-selector",
  events: "#events-team-selector",
  dev: "#dev-team-selector",
  graphics: "#graphics-team-selector",
  pr: "#pr-team-selector"
};

// Changes the selected gender
function chooseGender(gender) {
  // Switching the selected gender selector
  $(".selected-gender-button").removeClass("selected-gender-button");
  $(genderSelectors[gender]).addClass("selected-gender-button");
  // Updating the selected gender
  if (gender == "other") {
    // Showing the gender input field for other gender
    $("#gender-input").val("");
    $("#gender-input").fadeIn("fast");
  } else {
    // Hiding the gender input field for other gender
    $("#gender-input").fadeOut("fast", function() {
      $("#gender-input").val(gender);
    });
  }
}

// Limits the length of the reason to join to reasonToJoinMaxLength
function updateReasonToJoin() {
  var reason = $("#reason-textarea").val();

  if (reason.length > reasonToJoinMaxLength) {
    reason = reason.slice(0, reasonToJoinMaxLength);
  }
  $("#reason-textarea").val(reason);
}

// Selects or deselects a team
function selectTeam(team) {
  // Fetching the already selected teams
  var selectedTeams = $("#teams-input").val();
  var teamIndex = selectedTeams.indexOf(team);

  if (teamIndex >= 0) {
    // Given team is selected, deselecting it
    $(teamSelectors[team]).removeClass("selected-team-button");
    selectedTeams = selectedTeams.replace((teamIndex > 1 ? "," : "") + team, "");
  } else {
    // Given team is not selected, selecting it
    $(teamSelectors[team]).addClass("selected-team-button");
    selectedTeams += (selectedTeams.length > 0 ? "," : "") + team;
  }
  // Updating the selected teams
  $("#teams-input").val(selectedTeams);
}
