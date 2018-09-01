/* globals $ */
'use strict';

var reasonToJoinMaxLength = 500;

var genderSelectors = {
  male: "#male-gender-selector",
  female: "#female-gender-selector",
  other: "#other-gender-selector"
};

var teamSelectors = {
  enterntainment: "#enterntainment-team-selector",
  events: "#events-team-selector",
  dev: "#dev-team-selector",
  graphics: "#graphics-team-selector",
  pr: "#pr-team-selector"
};

function chooseGender(gender) {
  $(".selected-gender-button").removeClass("selected-gender-button");
  $(genderSelectors[gender]).addClass("selected-gender-button");
  if (gender == "other") {
    $("#gender-input").val($("#other-gender-input").val());
    $("#other-gender-input").show("fast");
  } else {
    $("#other-gender-input").hide("fast");
    $("#gender-input").val(gender);
  }
}

function updateReasonToJoin() {
  var reason = $("#reason-textarea").val();

  if (reason.length > reasonToJoinMaxLength) {
    reason = reason.slice(0, reasonToJoinMaxLength);
  }
  $("#reason-textarea").val(reason);
}

function selectTeam(team) {
  var selectedTeams = $("#teams-input").val();
  var teamIndex = selectedTeams.indexOf(team);

  if (teamIndex >= 0) {
    $(teamSelectors[team]).removeClass("selected-team-button");
    selectedTeams = selectedTeams.replace((teamIndex > 1 ? "," : " ") + team, "");
  } else {
    $(teamSelectors[team]).addClass("selected-team-button");
    selectedTeams += (selectedTeams.length > 0 ? "," : " ") + team;
  }
  $("#teams-input").val(selectedTeams);
}
