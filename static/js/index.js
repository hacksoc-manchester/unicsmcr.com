/* globals $ */
'use strict';

$.get("/events", function(events) {
  console.log(events);
});
