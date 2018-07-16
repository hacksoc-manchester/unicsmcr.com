"use strict";

const nodemailer = require('nodemailer');

const emailHelpers = require('../helpers/EmailHelpers');
const miscHelpers = require('../helpers/MiscHelpers');

exports.contactHackSoc = (sender, body) => {
  sendEmail({
    senderHost: process.env.EMAIL_HOST,
    senderPort: process.env.EMAIL_PORT,
    senderUsername: process.env.CONTACT_EMAIL,
    senderPassoword: process.env.CONTACT_EMAIL_PASSWORD
  }, process.env.CONTACT_EMAIL, sender, body);
};

exports.sendGreetingEmail = ({ recipient: { firstName, lastName, email } }) => {
  console.log({ firstName, lastName, email });
};

exports.sendGDPREmail = async ({ recipient: { firstName, lastName, email }}) => {
  const subscriptionId = miscHelpers.MakeRandomString(process.env.SUBSCRIPTION_ID_LENGTH);
  const subscribeLink = `http://www.hacksoc.com/subscriptions/create?firstName=${firstName}&lastName=${lastName}&email=${email}&subsciptionId=${subscriptionId}`;
  const unsubscribeLink = `http://www.hacksoc.com/subscriptions/remove?email=${email}&subsciptionId=${subscriptionId}`;

  const emailGen = await emailHelpers.generateEmail("./emailer/templates/GDPRemail.html", {
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
  sendEmail({
    senderHost: process.env.EMAIL_HOST,
    senderPort: process.env.EMAIL_PORT,
    senderUsername: process.env.NOREPLY_EMAIL,
    senderPassoword: process.env.NOREPLY_EMAIL_PASSWORD
  }, email, "Stick with us!", emailGen.email);
};

const sendEmail = ({ senderHost, senderPort, senderUsername, senderPassoword }, recipient, subject, content) => {
  const transporter = nodemailer.createTransport({
    host: senderHost,
    port: senderPort,
    secure: true,
    auth: {
        user: senderUsername,
        pass: senderPassoword
    }
  });

  const mailOptions = {
    from: senderUsername,
    to: recipient,
    subject,
    text: content
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(`Could not send email: ${err}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};
