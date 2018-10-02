"use strict";

const FB = require("fbgraph");

FB.setAccessToken(process.env.FB_API_TOKEN);

exports.getEvents = async () => {
  return new Promise(resolve => {
    FB.get("/hacksocmcr/events?fields=name,start_time,end_time,place&count=", (err, res) => {
      if (err) {
        throw new Error("Could not retrieve events");
      }
      const events = [];

      res.data.forEach(event => {
        events.push({
          ...event, place: event.place ? event.place.name : ""
        });
      });
      resolve(events);
    });
  });
};
