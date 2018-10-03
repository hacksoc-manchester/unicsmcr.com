/* globals $, window */
'use strict';

var maxEvents = 5;
var eventTemplate = '<div class="event row" onclick="openEvent(#id)"><div class="event-date col-3">' +
  '<div class="row event-month"><p>#month</p></div>' +
  '<div class="row event-day"><p>#day</p></div></div>' +
  '<div class="col-9"><div class="event-name row"><p>#name</p></div>' +
  '<div class="event-details row"><p>#time · #place</p></div></div></div>';
var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

$.get("/events", function (events) {
  var noOfEvents = 0;

  for (var index = 0; index < events.length; index++) {
    var event = events[index];
    var eventDate = new Date(event.start_time);
    var eventString = eventTemplate
      .replace(/#id/g, event.id)
      .replace(/#month/g, months[eventDate.getMonth()])
      .replace(/#day/g, eventDate.getDate())
      .replace(/#name/g, event.name)
      .replace(/#time/g, eventDate.getHours() + ":" + eventDate.getMinutes())
      .replace(/#place/g, event.place);

    var container = eventContainer(eventDate, new Date(event.end_time));

    container.parent().show();
    container.append(eventString);
    noOfEvents++;
    if (noOfEvents == maxEvents) {
      return;
    }
  }
});

function openEvent(id) {
  window.open("https://www.facebook.com/events/" + id, "_blank");
}

function eventContainer(startTime, endTime) {
  if (endTime < Date.now()) {
    return $("#past>.event-subset-list");
  } else if (startTime > Date.now()) {
    return $("#upcoming>.event-subset-list");
  } else {
    return $("#happening-now>.event-subset-list");
  }
}
