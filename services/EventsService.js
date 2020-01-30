"use strict";

const FB = require("fbgraph");

FB.setAccessToken(process.env.FB_API_TOKEN);

exports.getEvents = async () => {
  return new Promise(resolve => {
    FB.get("/unicsmanchester/events?fields=name,start_time,end_time,place",
      (err, res) => {
        if (err) {
          console.error("Could not retrieve events");
          return resolve({});
        }
        const events = res.data.map(event => {
          return {
            ...event,
            place: event.place ? event.place.name : ""
          };
        });

        resolve(events);
      });
  });
};
