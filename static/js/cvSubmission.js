/* globals $ */
"use strict";

function editSubmission() {
  $(".actions").fadeOut("fast", function() {
    $("#publish-button").hide();
    $("#edit-button").val("Save");
    $("#edit-button").removeClass("edit-button");
    $("#edit-button").addClass("submit-button");
    $("#edit-button").attr("onclick", "saveSubmission()");
    $(".actions").fadeIn("fast");
  });
  $(".static-field").fadeOut("fast", function() {
    $(".edit-field").fadeIn("fast");
  });
}

function saveSubmission() {
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
    success: function() {
      $("#success-message").html("Your submission has been updated successfully!");
      $("#success-message").show("slow");
    }
  });

  $(".actions").fadeOut("fast", function() {
    $("#publish-button").show();
    $("#edit-button").val("Edit");
    $("#edit-button").addClass("edit-button");
    $("#edit-button").removeClass("submit-button");
    $("#edit-button").attr("onclick", "editSubmission()");
    $(".actions").fadeIn("fast");
  });
  $(".edit-field").fadeOut("fast", function() {
    $(".static-field").fadeIn("fast");
  });
}
