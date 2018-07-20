"use strict";

const nodemailer = require('nodemailer');

const emailHelpers = require('../helpers/EmailHelpers');
const dbHelpers = require('../helpers/DbHelpers');
const response = require('../helpers/ReponseHelpers');
const miscHelpers = require('../helpers/MiscHelpers');

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

  if (emailGen.err) {
    return response.error(`Could not generate email: ${emailGen.message}`);
  }

  // Send the email to the recipient
  await sendEmail({
    senderHost: process.env.EMAIL_HOST,
    senderPort: process.env.EMAIL_PORT,
    senderUsername: process.env.NOREPLY_EMAIL,
    senderPassword: process.env.NOREPLY_EMAIL_PASSWORD
  }, email, "Welcome!", emailGen.data);
  return { err: false, message: "Email send request issued successfully!" };
};


// Sends a GDPR email to the provided recipient and creates a subscription request on the database
exports.sendGDPREmail = async (database, { recipient: { firstName, lastName, email } }, templateFile) => {
  // Generate data to replace the placeholdders on the template
  const subscriptionId = miscHelpers.MakeRandomString(process.env.SUBSCRIPTION_ID_LENGTH);
  const subscribeLink = `http://www.hacksoc.com/subscription/confirm?firstName=${firstName}&lastName=${lastName}&email=${email}&subscriptionId=${subscriptionId}`;
  const unsubscribeLink = `http://www.hacksoc.com/subscription/remove?email=${email}&subscriptionId=${subscriptionId}`;

  // Cerate the subscription request on the database
  dbHelpers.createSubscriptionRequest(database, { subscriberEmail: email, subscriptionId });

  // Generate the HTML for the email to be sent to the recipient
  const emailGen = await emailHelpers.generateEmail(templateFile, {
    "#firstName": firstName,
    "#lastName": lastName,
    "#email": email,
    "#subscribeLink": subscribeLink,
    "#unsubscribeLink": unsubscribeLink
  });

  if (emailGen.err) {
    return response.error(`Could not generate email: ${emailGen.message}`);
  }

  // Send the email to the recipient
  await sendEmail({
    senderHost: process.env.EMAIL_HOST,
    senderPort: process.env.EMAIL_PORT,
    senderUsername: process.env.NOREPLY_EMAIL,
    senderPassword: process.env.NOREPLY_EMAIL_PASSWORD
  }, email, "Stick with us!", emailGen.data);
  return { err: false, message: "Email send request issued successfully!" };
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
