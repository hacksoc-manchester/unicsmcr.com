"use strict";

const nodemailer = require('nodemailer');

const emailHelpers = require('../helpers/EmailHelpers');
const miscHelpers = require('../helpers/MiscHelpers');
const dbHelpers = require('../helpers/DbHelpers');

exports.contactHackSoc = (sender, body) => {
  sendEmail({
    senderHost: process.env.EMAIL_HOST,
    senderPort: process.env.EMAIL_PORT,
    senderUsername: process.env.CONTACT_EMAIL,
    senderPassword: process.env.CONTACT_EMAIL_PASSWORD
  }, process.env.CONTACT_EMAIL, sender, body);
};

exports.sendGreetingEmail = async ({ recipient: { firstName, lastName, email, subscriptionId } }) => {
  const unsubscribeLink = `http://www.hacksoc.com/subscription/remove?email=${email}&subscriptionId=${subscriptionId}`;

  const emailGen = await emailHelpers.generateEmail("./emailer/templates/GreetingEmail.html", {
    "#firstName": firstName,
    "#lastName": lastName,
    "#email": email,
    "#unsubscribeLink": unsubscribeLink
  });

  if (emailGen.err) {
    console.log(emailGen.message);
    return { err: true, message: "Could not generate email!" };
  }
  await sendEmail({
    senderHost: process.env.EMAIL_HOST,
    senderPort: process.env.EMAIL_PORT,
    senderUsername: process.env.NOREPLY_EMAIL,
    senderPassword: process.env.NOREPLY_EMAIL_PASSWORD
  }, email, "Welcome!", emailGen.data);
  return { err: false, message: "Email send request issued successfully!" };
};

exports.sendGDPREmail = async (database, { recipient: { firstName, lastName, email } }, templateFile) => {
  const subscriptionId = miscHelpers.MakeRandomString(process.env.SUBSCRIPTION_ID_LENGTH);
  const subscribeLink = `http://www.hacksoc.com/subscription/confirm?firstName=${firstName}&lastName=${lastName}&email=${email}&subscriptionId=${subscriptionId}`;
  const unsubscribeLink = `http://www.hacksoc.com/subscription/remove?email=${email}&subscriptionId=${subscriptionId}`;

  dbHelpers.createSubscriptionRequest(database, { subscriberEmail: email, subscriptionId });

  const emailGen = await emailHelpers.generateEmail(templateFile, {
    "#firstName": firstName,
    "#lastName": lastName,
    "#email": email,
    "#subscribeLink": subscribeLink,
    "#unsubscribeLink": unsubscribeLink
  });

  if (emailGen.err) {
    console.log(emailGen.message);
    return { err: true, message: "Could not generate email!" };
  }
  await sendEmail({
    senderHost: process.env.EMAIL_HOST,
    senderPort: process.env.EMAIL_PORT,
    senderUsername: process.env.NOREPLY_EMAIL,
    senderPassword: process.env.NOREPLY_EMAIL_PASSWORD
  }, email, "Stick with us!", emailGen.data);
  return { err: false, message: "Email send request issued successfully!" };
};

const sendEmail = ({ senderHost, senderPort, senderUsername, senderPassword }, recipient, subject, content) => {
  // TODO: change the name of the sender
  const transporter = nodemailer.createTransport({
    host: senderHost,
    port: senderPort,
    secure: true,
    auth: {
      user: senderUsername,
      pass: senderPassword
    }
  });

  const mailOptions = {
    from: senderUsername,
    to: recipient,
    subject,
    html: content
  };

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
