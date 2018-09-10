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

// Selects given job
function selectJob(jobId) {
  selectedJob = findJobById(jobId);
  if (!selectedJob) {
    return;
  }
  // Updating the selected job in the list
  $(".selected").removeClass("selected");
  $("#" + selectedJob.id).addClass("selected");
  // Updating the shown job in job overview
  $("#logo").css("background-image", "url('" + selectedJob.logoLink + "')");
  $("#title").html(selectedJob.position);
  $("#company").html(selectedJob.company);
  $("#location").html(selectedJob.location);
  $("#job-overview-description").html(selectedJob.description);
  if (window.outerWidth <= 992) {
    // Showing only the job overview on a smaller screen
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

// Opens new tab with the application to the job
function apply() {
  window.open(selectedJob.applyLink, "_blank");
}

// Closes the job overview on smaller screens
function closeJob() {
  if (window.outerWidth <= 992) {
    $("#job-overview").fadeOut("fast", function () {
      $("#job-listings").fadeIn("fast");
    });
  }
}

// Template to be used when rendering the jobs list
var jobListingTemplate = "<div id='#id' class='job-listing align-left row smooth-transitions no-side-buffers' onclick='selectJob(#id)'>" +
  "<span class='selector hidden smooth-transitions'></span>" +
  "<div class='col-2 job-listing-logo' style=\"background-image: url('#logoLink')\">" +
  "</div><div class='col-9 job-listing-info'><div class='job-listing-title hide-overflow'>" +
  "#position</div><div class='job-listing-details hide-overflow'>#company</div>" +
  "<div class='job-listing-details hide-overflow'>#location</div>" +
  "</div></div><hr class='seperator'>";

// Filters the jobs list by given company
function filterByCompany(company) {
  var firstListing;

  $(".job-listings-container").html("");
  for (var index = 0; index < jobs.length; index++) {
    var job = jobs[index];

    if (job.company == company || company == "all") {
      if (!firstListing) {
        firstListing = job;
      }
      // Generating string for the job from template
      var listingString = jobListingTemplate
        .replace(/#id/g, job.id)
        .replace(/#logoLink/g, job.logoLink)
        .replace(/#position/g, job.position)
        .replace(/#company/g, job.company)
        .replace(/#location/g, job.location)
        .replace(/#location/g, job.location);

      // Rendering new job
      $(".job-listings-container").append(listingString);
    }
  }
  if (firstListing) {
    // Selecting the first job on the list if possible
    selectJob(firstListing.id);
  }
}
