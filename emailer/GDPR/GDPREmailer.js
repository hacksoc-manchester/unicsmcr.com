"use strict";

require('dotenv').load();
const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const emailService = require("../../services/EmailService");
const loggingService = require('../../services/LoggingService');

// Sends GDPR confirmation emails to specified contacts
// Example csv file:
//  firstName,lastName,email
//  Kristijonas,Zalys,kzalys@gmail.com
// Note: the first line should include column names
class GDPREmailer {
  constructor() {
    this.contacts = [];
  }

  loadContacts(contactsFile) {
    console.log("Loading contacts");
    return new Promise((resolve, reject) => {
      fs.readFile(contactsFile, 'utf8', (err, contactsString) => {
        if (err) {
          console.log("Could not read contacts file!");
          console.log(err);
          reject(err);
        }
        this.contacts = parse(contactsString, { columns: true });
        console.log(`Found ${this.contacts.length} contacts`);
        resolve();
      });
    });
  }

  async sendEmails(database, templateFile) {
    console.log("Sending emails to contacts");
    for (const contact of this.contacts) {
      console.log(`Sending email to ${contact.firstName} ${contact.lastName} ${contact.email}`);
      try {
        await emailService.sendGDPREmail(database, { recipient: contact }, templateFile);
        loggingService.logMessage(loggingService.emailRequestIssued, `${contact.firstName},${contact.lastName},${contact.email}\n`);
        console.log(`Email to ${contact.firstName} ${contact.lastName} ${contact.email} sent successfully!`);
      } catch (err) {
        console.log(`ERROR: Could not send email to ${contact.firstName} ${contact.lastName} ${contact.email} : CATCH`);
        console.log(err);
      }
    }
  }
}


const SendEmails = async (contactsFile, templateFile) => {
  const emailer = new GDPREmailer();

  await emailer.loadContacts(contactsFile);

  console.log("Connecting to database");
  const database = require('../../db/Sequelize').init();

  await database.sequelize.sync();
  console.log("Successfully connected to database");

  await emailer.sendEmails(database, templateFile);
  console.log("Completed sending emails. Ctrl^C to exit.");
};

SendEmails('./emailer/GDPR/contacts.csv', "./emailer/templates/GDPRemail.html");
