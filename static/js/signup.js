/* globals $ */
'use strict';

// The HTML forms
var forms = {
  newsletter: {
    name: "Newsletter",
    id: "#newsletter-form",
    selectorId: "#newsletterFormSelector"
  },
  volunteer: {
    name: "Volunteer",
    id: "#volunteer-form",
    selectorId: "#volunteerFormSelector"
  },
  committee: {
    name: "Committee",
    id: "#committee-form",
    selectorId: "#committeeFormSelector"
  }
};

// Currently selected form
var currentFormKey = "newsletter";
var currentForm = forms[currentFormKey];

// Hides the currently selected form and shows the given form
function showForm(formKey) {
  // Hide currently selected form
  $(currentForm.id).fadeOut("fast", function () {
    // Show given form
    $(forms[formKey].id).fadeIn("fast");
  });
  // Hide form selectors and reorder them based on the given form
  $("#formSelectors").fadeOut("fast", function () {
    // Reordering the form selectors
    $(currentForm.selectorId).html("<h1>" + forms[formKey].name + "</h1>");
    $(currentForm.selectorId).attr("onclick", "");
    $(forms[formKey].selectorId).html("<h3>" + currentForm.name + "</h3>");
    $(forms[formKey].selectorId).attr("onclick", "showForm('" + currentFormKey + "')");
    $(currentForm.selectorId).attr("id", "tempId");
    $(forms[formKey].selectorId).attr("id", currentForm.selectorId.slice(1));
    $("#tempId").attr("id", forms[formKey].selectorId.slice(1));
    // Showing the form selectors
    $("#formSelectors").fadeIn("fast");
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
