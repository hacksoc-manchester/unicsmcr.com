// Helper functions for the Email service
"use strict";

const fs = require('fs');

// Generates email string from given template with give placeholder replacements
// placeholderReplacements lookup table structure: key: {placeholderName}, value: {placeholderValue}
exports.generateEmail = async (template, placeholderReplacements) => {
  try {
    const emailGen = await new Promise((resolve, reject) => {
      fs.readFile(template, 'utf8', (err, html) => { // Read the temaplate
        if (err) {
          return reject(err);
        }

        for (const placeholderName in placeholderReplacements) { // Replace placeholders
          if (placeholderReplacements.hasOwnProperty(placeholderName)) {
            const replacement = placeholderReplacements[placeholderName];

            html = html.replace(new RegExp(placeholderName, "g"), replacement);
          }
        }
        // Email generated
        return resolve(html);
      });
    });

    // Email generated
    return emailGen;
  } catch (err) {
    throw new Error(`Could not generate email: ${err}`);
  }
};
