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

$(".job-listing").click(function () {
  selectJob($(this).attr('id'));
});

$(window).resize(function () {
  if (window.outerWidth > 992) {
    if ($("#job-listings").css("display") == "none") {
      $("#job-listings").fadeIn("fast");
    }
    if ($("#job-overview").css("display") == "none") {
      $("#job-overview").fadeIn("fast");
    }
    if (!selectedJob) {
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