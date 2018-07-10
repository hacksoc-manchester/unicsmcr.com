"use strict";

exports.mapPhotosetsToGalleries = (photosets) => {
  const galleries = photosets.photoset.map(g => {
    return {
      title: g.title._content,
      description: g.description._content,
      link: `https://www.flickr.com/photos/${process.env.FLICKR_USER_ID}/sets/${g.id}`,
      thumbUrl: g.primary_photo_extras.url_m
    };
  });

  return galleries;
};
