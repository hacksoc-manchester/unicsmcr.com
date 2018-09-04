"use strict";

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailHelpers = require('../helpers/EmailHelpers');

// Sends an email to info@hacksoc
exports.contactHackSoc = (sender, body) => {
  // Forward the message to info@hacksoc.com
  sendEmail("contact@hacksoc.com", "contact@hacksoc.com", sender, body);
};

exports.sendCVBankEmailVerificationEmail = async (cvSubmission) => {
  const emailVerifyLink = `https://www.hacksoc.com/cv/submission/verify?email=${cvSubmission.email}&emailToken=${cvSubmission.emailToken}`;
  // Generate the HTML for the email to be sent to the recipient
  const content = await emailHelpers.generateEmail("./emailTemplates/CVBankEmailVerify.html", {
    "#emailVerifyLink": emailVerifyLink
  });

  return sendEmail("The HackSoc Team <noreply@hacksoc.com>", cvSubmission.email, "CV Bank email verification", content);
};

// Sends an email to specified recipient with specified sender credentials and specified content
const sendEmail = (sender, recipient, subject, content) => {
  const msg = {
    to: recipient,
    from: sender,
    subject: subject,
    html: content
  };

  sgMail.send(msg, false, (error) => {
    if (error) {
      console.log(`Email for ${recipient} failed:`);
      console.log(error);
    }
  });
};
