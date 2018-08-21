"use strict";

const nodemailer = require('nodemailer');

const emailHelpers = require('../helpers/EmailHelpers');

// Sends an email to info@hacksoc
exports.contactHackSoc = (sender, body) => {
  // Forward the message to info@hacksoc.com
  sendEmail({
    senderHost: process.env.EMAIL_HOST,
    senderPort: process.env.EMAIL_PORT,
    senderUsername: process.env.CONTACT_EMAIL,
    senderPassword: process.env.CONTACT_EMAIL_PASSWORD
  }, process.env.CONTACT_EMAIL, sender, body);
};

// Sends a greeting to a new subscriber
exports.sendGreetingEmail = async ({ recipient: { firstName, lastName, email, subscriptionId } }) => {
  // Generate data to replace the placeholdders on the template
  const unsubscribeLink = `http://www.hacksoc.com/subscription/remove?email=${email}&subscriptionId=${subscriptionId}`;

  // Generate the HTML for the email to be sent to the recipient
  const emailGen = await emailHelpers.generateEmail("./emailer/templates/GreetingEmail.html", {
    "#firstName": firstName,
    "#lastName": lastName,
    "#email": email,
    "#unsubscribeLink": unsubscribeLink
  });

  // Send the email to the recipient
  await sendEmail({
    senderHost: process.env.EMAIL_HOST,
    senderPort: process.env.EMAIL_PORT,
    senderUsername: process.env.NOREPLY_EMAIL,
    senderPassword: process.env.NOREPLY_EMAIL_PASSWORD
  }, email, "Welcome!", emailGen);
};

// Sends an email to specified recipient with specified sender credentials and specified content
const sendEmail = ({ senderHost, senderPort, senderUsername, senderPassword }, recipient, subject, content) => {
  // Create a tranporter for the email
  const transporter = nodemailer.createTransport({
    host: senderHost,
    port: senderPort,
    secure: true,
    auth: {
      user: senderUsername,
      pass: senderPassword
    }
  });

  // Configure the email metadata
  const mailOptions = {
    from: `The Hacksoc Team <${senderUsername}>`,
    to: recipient,
    subject,
    html: content
  };

  // Send the email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(`Could not send email: ${err}`);
        return reject(err);
      }
      resolve({ err: false, message: info.response });
    });
  });
};
