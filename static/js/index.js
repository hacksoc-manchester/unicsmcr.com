/* globals $, window */
'use strict';

var maxEvents = 5;
var eventTemplate = '<div class="event row" onclick="openEvent(#id)"><div class="event-date col-3">' +
  '<div class="row event-month"><p>#month</p></div>' +
  '<div class="row event-day"><p>#day</p></div></div>' +
  '<div class="col-9"><div class="event-name row"><p>#name</p></div>' +
  '<div class="event-details row"><p>#time · #place</p></div></div></div>';
var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

$.get("/events", function (events) {
  var noOfEvents = 0;

  for (var index = 0; index < events.length; index++) {
    var event = events[index];

    var formattedEventStartTime = event.start_time.slice(0, -5);
    var eventDate = new Date(formattedEventStartTime);
    var minutes = (eventDate.getMinutes() < 10 ? "0" : "") + eventDate.getMinutes();
    var startTime = days[eventDate.getDay()] + " " + eventDate.getHours() + ":" + minutes;
    var eventString = eventTemplate
      .replace(/#id/g, event.id)
      .replace(/#month/g, months[eventDate.getMonth()])
      .replace(/#day/g, eventDate.getDate())
      .replace(/#name/g, event.name)
      .replace(/#time/g, startTime)
      .replace(/#place/g, event.place);

    var formattedEventEndTime = event.end_time.slice(0, -5);
    var container = eventContainer(eventDate, new Date(formattedEventEndTime));

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
