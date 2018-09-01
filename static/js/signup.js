/* globals $ */
'use strict';

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

var currentFormKey = "newsletter";
var currentForm = forms[currentFormKey];

function showForm(formKey) {
  $(currentForm.id).fadeOut("fast", function() {
    $(forms[formKey].id).fadeIn("fast");
  });
  $("#formSelectors").fadeOut("fast", function() {
    $(currentForm.selectorId).html("<h1>" + forms[formKey].name + "</h1>");
    $(currentForm.selectorId).attr("onclick", "");
    $(forms[formKey].selectorId).html("<h3>" + currentForm.name + "</h3>");
    $(forms[formKey].selectorId).attr("onclick", "showForm('" + currentFormKey + "')");
    $(currentForm.selectorId).attr("id", "tempId");
    $(forms[formKey].selectorId).attr("id", currentForm.selectorId.slice(1));
    $("#tempId").attr("id", forms[formKey].selectorId.slice(1));
    $("#formSelectors").fadeIn("fast");
    currentFormKey = formKey;
    currentForm = forms[currentFormKey];
  });
}
