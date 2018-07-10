"use strict";

const Flickr = require("flickrapi");
const flickrOptions = {
  api_key: process.env.FLICKR_API_KEY,
  secret: process.env.FLICKR_API_SECRET
};

exports.getGalleries = (callback) => {
  Flickr.tokenOnly(flickrOptions, function (error, flickr) {
    if (error) {
      return callback("Could not connect to Flickr API!", null);
    }
    flickr.photosets.getList({
      api_key: process.env.FLICKR_API_KEY,
      user_id: process.env.FLICKR_USER_ID,
      primary_photo_extras: ["url_m"]
    }, (err, data) => {
      if (err) {
        return callback("Could download gallery from Flickr API!", null);
      }
      const galleries = data.photosets.photoset.map(g => {
        return {
          title: g.title._content,
          description: g.description._content,
          link: `https://www.flickr.com/photos/${process.env.FLICKR_USER_ID}/sets/${g.id}`,
          thumbUrl: g.primary_photo_extras.url_m
        };
      });

      return callback(null, galleries);
    });
  });
};
