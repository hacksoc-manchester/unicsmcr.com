/* globals $ */
'use strict';

// The HTML forms
var forms = {
  newsletter: {
    name: "Newsletter",
    id: "#newsletter-form-container",
    selectorId: "#newsletter-form-selector"
  },
  volunteer: {
    name: "Volunteer",
    id: "#application-form-container",
    selectorId: "#volunteer-form-selector",
    errorContainer: "#volunteer-error",
    action: "/signup/volunteer/apply",
    description: "<b>Help us organise our events by volunteering.<br>Just fill in this form and we'll contact you when we need help</b>"
  },
  committee: {
    name: "Committee",
    id: "#application-form-container",
    selectorId: "#committee-form-selector",
    errorContainer: "#committee-error",
    action: "/signup/committee/apply",
    description: "<b>Become a part of our committee.<br>Just fill in this form and we'll contact you when a position becomes available</b>"
  }
};

// Currently selected form
var currentFormKey = "newsletter";
var currentForm = forms[currentFormKey];

// Hides the currently selected form and shows the given form
function showForm(formKey) {
  // Hide currently selected form
  $(currentForm.id).fadeOut("fast", function () {
    if (formKey != "newsletter") {
      $("#application-form").prop("action", forms[formKey].action);
      $("#form-description").html(forms[formKey].description);
      $(".application-error").hide();
      $(forms[formKey].errorContainer).show();
    }
    // Show given form
    $(forms[formKey].id).fadeIn("fast");
  });
  // Hide form selectors and reorder them based on the given form
  $("#form-selectors").fadeOut("fast", function () {
    // Reordering the form selectors
    $(currentForm.selectorId).html("<h1>" + forms[formKey].name + "</h1>");
    $(currentForm.selectorId).attr("onclick", "");
    $(forms[formKey].selectorId).html("<h3>" + currentForm.name + "</h3>");
    $(forms[formKey].selectorId).attr("onclick", "showForm('" + currentFormKey + "')");
    $(currentForm.selectorId).attr("id", "tempId");
    $(forms[formKey].selectorId).attr("id", currentForm.selectorId.slice(1));
    $("#tempId").attr("id", forms[formKey].selectorId.slice(1));
    // Showing the form selectors
    $("#form-selectors").fadeIn("fast");
    // Updating the currently selected form
    currentFormKey = formKey;
    currentForm = forms[currentFormKey];
  });
}

// Toggles the value of the given checkbox
function toggleCheckbox(checkboxId) {
  var checkbox = $("#" + checkboxId);

  checkbox.prop("checked", !checkbox.prop("checked"));
}
