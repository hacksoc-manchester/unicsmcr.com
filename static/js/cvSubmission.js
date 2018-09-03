/* globals $, window */
"use strict";

function editSubmission() {
  $(".actions").fadeOut("fast", function () {
    $("#publish-button").hide();
    $("#edit-button").val("Save");
    $("#edit-button").removeClass("edit-button");
    $("#edit-button").addClass("submit-button");
    $("#edit-button").attr("onclick", "saveSubmission()");
    $(".actions").fadeIn("fast");
  });
  $(".static-field").fadeOut("fast", function () {
    $(".edit-field").fadeIn("fast");
  });
}

function saveSubmission() {
  $("#success-message").fadeOut("fast");
  $("#error-message").fadeOut("fast");
  $("#edit-button").prop("disabled", true);
  var firstName = $("input[name='firstName'").val();
  var lastName = $("input[name='lastName'").val();
  var cvLink = $("input[name='cvLink'").val();

  $.ajax({
    type: "POST",
    url: "/cv/submission/edit",
    data: {
      firstName: firstName,
      lastName: lastName,
      cvLink: cvLink
    },
    success: function (response) {
      if (response.err) {
        $("#error-message").html("Your submission was not updated! " + response.err);
        $("#error-message").fadeIn("slow");
      } else {
        $("#success-message").html("Your submission has been updated successfully!");
        $("#success-message").fadeIn("slow");
        $(".actions").fadeOut("fast", function () {
          $("#publish-button").show();
          $("#edit-button").val("Edit");
          $("#edit-button").addClass("edit-button");
          $("#edit-button").removeClass("submit-button");
          $("#edit-button").attr("onclick", "editSubmission()");
          $(".actions").fadeIn("fast");
        });
        $(".edit-field").fadeOut("fast", function () {
          $("#first-name").html(firstName);
          $("#last-name").html(lastName);
          $("#cv-link").html("<a href='" + cvLink + "' target='_blank' rel='noopener noreferrer'>" + cvLink + "</a>");
          $(".static-field").fadeIn("fast");
        });
      }
      $("#edit-button").prop("disabled", false);
    }
  });
}

function publish() {
  $("#success-message").fadeOut("fast");
  $("#error-message").fadeOut("fast");
  $("#publish-button").prop("disabled", true);
  $.ajax({
    type: "POST",
    url: "/cv/submission/publish",
    success: function (response) {
      if (response.err) {
        $("#error-message").html(response.message);
        $("#error-message").fadeIn("slow");
      } else {
        $("#success-message").html(response.message);
        $("#success-message").fadeIn("slow");
      }
      console.log(response);
      if (response.submissionStatus == true) {
        $("#publish-button").val("Make Private");
        $("#submission-status").html("published");
      } else {
        $("#publish-button").val("Publish");
        $("#submission-status").html("private");
      }
      $("#publish-button").prop("disabled", false);
    }
  });
}
