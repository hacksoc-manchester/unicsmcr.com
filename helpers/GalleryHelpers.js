// Helper functions for the Gallery page
"use strict";

const response = require('./ReponseHelpers');

// Maps Flickr photosets to gallery objects that can be displayed on the page
exports.mapPhotosetsToGalleries = (photosets) => {
  try {
    const galleries = photosets.photoset.map(g => { // Map all sets
      return { // Include only the required fields
        title: g.title._content,
        description: g.description._content,
        link: `https://www.flickr.com/photos/${process.env.FLICKR_USER_ID}/sets/${g.id}`,
        thumbUrl: g.primary_photo_extras.url_m
      };
    });

    return response.success('Mapped photosets to galleries', galleries);
  } catch (err) {
    return response.error(`Could not convert photosets to galleries: ${err}`);
  }
};
