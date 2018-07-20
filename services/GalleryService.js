"use strict";

const Flickr = require("flickr-sdk");

const galleryHelpers = require('../helpers/GalleryHelpers');

// Fetches the galleries from the Flickr API
exports.getGalleries = (callback) => {
  // Connecting to Flickr
  const flickr = new Flickr(process.env.FLICKR_API_KEY);

  // Fetchinfg the data from Flickr
  flickr.photosets.getList({
    api_key: process.env.FLICKR_API_KEY,
    user_id: process.env.FLICKR_USER_ID,
    primary_photo_extras: ["url_m"]
  }).then(data => {
    try {
      // Processing the received data
      const parsedData = JSON.parse(data.text);
      const galleries = galleryHelpers.mapPhotosetsToGalleries(parsedData.photosets).data;

      return callback(null, galleries.data);
    } catch (err) {
      return callback(`Could not parse Flickr API response: ${err}`, null);
    }
  }).catch(err => {
    return callback(`Could download gallery from Flickr API: ${err}`, null);
  });
};
