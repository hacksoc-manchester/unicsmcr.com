"use strict";

const got = require('got');

exports.getEvents = async (req, res) => {
  // const response = await got(`https://graph.facebook.com/v3.1/poxuistai/posts?access_token=${process.env.FB_API_TOKEN}`);

  // res.send(JSON.parse(response.body).data[0]);
  res.send(await fetchEventsFromAPI());
};

const fetchEventsFromAPI = async () => {
  try {
    const url = `https://graph.facebook.com/v3.1/poxuistai/posts?access_token=${process.env.FB_API_TOKEN}`;
    const response = await got(url);

    return JSON.parse(response.body);
  } catch (err) {
    return err;
  }
};
