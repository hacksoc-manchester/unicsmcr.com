// Helper functions for the Email service
"use strict";

const fs = require('fs');

const response = require('./ReponseHelpers');

// Generates email string from given template with give placeholder replacements
// placeholderReplacements lookup table structure: key: {placeholderName}, value: {placeholderValue}
exports.generateEmail = async (template, placeholderReplacements) => {
  try {
    const emailGen = await new Promise(resolve => { // REVIEW: code cleanup needed
      fs.readFile(template, 'utf8', (err, html) => { // Read the temaplate
        if (err) {
          return resolve(response.error(err));
        }

        for (const placeholderName in placeholderReplacements) { // Replace placeholders
          if (placeholderReplacements.hasOwnProperty(placeholderName)) {
            const replacement = placeholderReplacements[placeholderName];

            html = html.replace(new RegExp(placeholderName, "g"), replacement);
          }
        }
        // Email generated
        return resolve(response.success("Generated email succesfully!", html));
      });
    });

    if (emailGen.err) {
      throw new Error(emailGen.message);
    }
    // Email generated, returning response
    return response.success(emailGen.message, emailGen.data);
  } catch (err) {
    return response.error(`Could not generate email: ${err}`);
  }
};
