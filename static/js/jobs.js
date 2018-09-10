/* globals $, window */
'use strict';

var jobs;
var selectedJob;

function initScript(_jobs) {
  jobs = _jobs;
  if (jobs && jobs.length > 0 && window.outerWidth > 992) {
    selectJob(jobs[0].id);
  }
}

$(window).resize(function () {
  if (window.outerWidth > 992) {
    if ($("#job-listings").css("display") == "none") {
      $("#job-listings").fadeIn("fast");
    }
    if ($("#job-overview").css("display") == "none") {
      $("#job-overview").fadeIn("fast");
    }
    if (!selectedJob && jobs && jobs.length > 0) {
      selectJob(jobs[0].id);
    }
  } else {
    if ($("#job-overview").css("display") != "none") {
      $("#job-overview").hide();
    }
    if ($("#job-listings").css("display") == "none") {
      $("#job-listings").show();
    }
  }
});
$(window).trigger('resize');

function selectJob(jobId) {
  selectedJob = findJobById(jobId);
  if (!selectedJob) {
    return;
  }
  $(".selected").removeClass("selected");
  $("#" + selectedJob.id).addClass("selected");
  $("#logo").css("background-image", "url('" + selectedJob.logoLink + "')");
  $("#title").html(selectedJob.position);
  $("#company").html(selectedJob.company);
  $("#location").html(selectedJob.location);
  $("#job-overview-description").html(selectedJob.description);
  if (window.outerWidth <= 992) {
    $("#job-listings").fadeOut("fast", function () {
      $("#job-overview").fadeIn("fast");
    });
  }
}

function findJobById(jobId) {
  for (var index = 0; index < jobs.length; index++) {
    var job = jobs[index];

    if (job.id == jobId) {
      return job;
    }
  }
  return null;
}

function apply() {
  window.open(selectedJob.applyLink, "_blank");
}

function closeJob() {
  if (window.outerWidth <= 992) {
    $("#job-overview").fadeOut("fast", function () {
      $("#job-listings").fadeIn("fast");
    });
  }
}

var jobListingTemplate = "<div id='#id' class='job-listing align-left row smooth-transitions no-side-buffers' onclick='selectJob(#id)'>" +
  "<span class='selector hidden smooth-transitions'></span>" +
  "<div class='col-2 job-listing-logo' style=\"background-image: url('#logoLink')\">" +
  "</div><div class='col-9 job-listing-info'><div class='job-listing-title hide-overflow'>" +
  "#position</div><div class='job-listing-details hide-overflow'>#company</div>" +
  "<div class='job-listing-details hide-overflow'>#location</div>" +
  "</div></div><hr class='seperator'>";

function filterByCompany(company) {
  var firstListing;

  $(".job-listings-container").html("");
  for (var index = 0; index < jobs.length; index++) {
    var job = jobs[index];

    if (job.company == company || company == "all") {
      if (!firstListing) {
        firstListing = job;
      }
      var listingString = jobListingTemplate
        .replace(/#id/g, job.id)
        .replace(/#logoLink/g, job.logoLink)
        .replace(/#position/g, job.position)
        .replace(/#company/g, job.company)
        .replace(/#location/g, job.location)
        .replace(/#location/g, job.location);

        $(".job-listings-container").append(listingString);
    }
  }
  if (firstListing) {
    selectJob(firstListing.id);
  }
}
