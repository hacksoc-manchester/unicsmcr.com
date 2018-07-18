"use strict";

const Flickr = require("flickr-sdk");

const galleryHelpers = require('../helpers/GalleryHelpers');

exports.getGalleries = (callback) => {
  const flickr = new Flickr(process.env.FLICKR_API_KEY);

  flickr.photosets.getList({
    api_key: process.env.FLICKR_API_KEY,
    user_id: process.env.FLICKR_USER_ID,
    primary_photo_extras: ["url_m"]
  }).then(data => {
    try {
      const parsedData = JSON.parse(data.text);
      const galleries = galleryHelpers.mapPhotosetsToGalleries(parsedData.photosets).data;

      return callback(null, galleries);
    } catch (err) {
      return callback(`Could not parse Flickr API response: ${err}`, null);
    }
  }).catch(err => {
    return callback(`Could download gallery from Flickr API: ${err}`, null);
  });
};
