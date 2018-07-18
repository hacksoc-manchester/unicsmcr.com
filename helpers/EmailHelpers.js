"use strict";

const fs = require('fs');

exports.generateEmail = (template, placeholderReplacements) => {
  return new Promise(resolve => {
    fs.readFile(template, 'utf8', (err, html) => {
      if (err) {
        return resolve({ err: true, message: "Could not read template file!" });
      }
      let email = html;

      for (const key in placeholderReplacements) {
        if (placeholderReplacements.hasOwnProperty(key)) {
          const replacement = placeholderReplacements[key];

          email = email.replace(new RegExp(key, "g"), replacement);
        }
      }
      return resolve({ err: false, message: "Generated email succesfully!", email });
    });
  });
};
