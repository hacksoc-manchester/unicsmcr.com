// Helper functions for communication with the database
"use strict";

const miscHelpers = require("../helpers/MiscHelpers");

// Creates a new subscriber
exports.createSubscriber = async (
  database,
  { firstName, lastName, email, subscriptionId }
) => {
  try {
    if (!subscriptionId) {
      // If no subscriptionId is provided, generate a subscriptionId
      subscriptionId = miscHelpers.MakeRandomString(
        process.env.SUBSCRIPTION_ID_LENGTH || 15
      );
    }
    // Check if a subscriber with given email exists
    const existingSubscriber = await database.models.subscriber.findOne({
      where: {
        email
      }
    });

    if (existingSubscriber) {
      // If the given email is already taken, a new subscriber cannot be created
      throw new Error(`${email} is already taken`);
    }

    // Creating a new subscriber
    const newSubscriber = await database.models.subscriber.create({
      firstName,
      lastName,
      email,
      subscriptionId
    });

    // Subscriber created, returning response
    return newSubscriber ? newSubscriber.dataValues : null;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.findSubscriberByEmail = async (database, email) => {
  try {
    // Fetch the subscriber from the database
    const subscriber = await database.models.subscriber.findOne({
      where: { email }
    });

    // Returning subscriber's data values or null if subscriber could not be found
    return subscriber ? subscriber.dataValues : null;
  } catch (err) {
    throw new Error(`Could not find subscriber ${err}`);
  }
};

// Removes an existing subscriber
exports.removeSubscriber = async (database, { email, subscriptionId }) => {
  try {
    // Remove the subscriber from the database
    await database.models.subscriber.destroy({
      where: {
        email,
        subscriptionId
      }
    });

    // Subscriber removed, returning response
    return { err: false };
  } catch (err) {
    throw new Error(`Could not remove subscriber: ${err}`);
  }
};

// Gets a list of all subscribers (admin use only)
exports.getSubscribers = async database => {
  try {
    // Get the list of all subscribers
    const subscribers = await database.models.subscriber.findAll({
      attributes: ["firstName", "lastName", "email", "subscriptionId"]
    });

    // List of all subscribers received, returning response
    return subscribers ? subscribers.map(s => s.dataValues) : [];
  } catch (err) {
    throw new Error(`Could not list subscribers: ${err}`);
  }
};

// Creates a new subscription request
exports.createSubscriptionRequest = async (database, { subscriberEmail }) => {
  try {
    // Check if a subscription/subscription request already exist for the given email
    // if it does, use the existing subscriptionId
    const existingSubscriptionRequest = await database.models.subscriptionrequest.findOne(
      {
        where: {
          subscriberEmail
        }
      }
    );

    if (existingSubscriptionRequest) {
      // Subsription request already exists, returning
      return existingSubscriptionRequest.dataValues;
    }
    const existingSubscriber = await database.models.subscriber.findOne({
      where: {
        email: subscriberEmail
      }
    });

    if (existingSubscriber) {
      throw new Error(`Subscriber ${subscriberEmail} already exists!`);
    }
    // No form of preexisting subscription found, creating new subscription request
    const subscriptionId = miscHelpers.MakeRandomString(
      process.env.SUBSCRIPTION_ID_LENGTH || 15
    );

    // Create subscription request
    const subRequest = await database.models.subscriptionrequest.create({
      subscriberEmail,
      subscriptionId
    });

    // Subscription request created, returning response
    return subRequest ? subRequest.dataValues : null;
  } catch (err) {
    throw new Error(`Could not create subscription request: ${err}`);
  }
};

// Confirms a subscription request
exports.confirmSubscriptionRequest = async (
  database,
  { subscriptionId, subscriberEmail }
) => {
  try {
    // Find the subscription request in question
    const subRequest = await database.models.subscriptionrequest.findOne({
      where: {
        subscriptionId,
        subscriberEmail
      }
    });

    if (!subRequest) {
      // Specified subscription request does not exist
      throw new Error(`Subscription request for ${subscriberEmail} not found!`);
    }
    // Subscrition request has been confirmed and can now be removed from the database
    await subRequest.destroy();
    // Subscription request confirmed, returning response
    return { err: false };
  } catch (err) {
    throw new Error(`Could not confirm subscription request: ${err}`);
  }
};

// Creates a new CommitteeApplication
exports.createCommitteeApplication = async (database, application) => {
  // Checking if the user already has a CommitteeApplication
  const existingApplication = await database.models.committeeapplication.findOne(
    {
      where: {
        email: application.email
      }
    }
  );

  if (existingApplication) {
    throw new Error(
      `${application.email} has already applied to the committee`
    );
  }
  // Creating new CommitteeApplication
  const newApplication = await database.models.committeeapplication.create({
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    subjectOfStudy: application.subjectOfStudy,
    yearOfStudy: application.yearOfStudy,
    gender: application.gender,
    teams: application.teams,
    reasonToJoin: application.reasonToJoin
  });

  return newApplication ? newApplication.dataValues : null;
};

// Creates a new VolunteerApplication
exports.createVolunteerApplication = async (database, application) => {
  // Checking if the user already has a VolunteerApplication
  const existingApplication = await database.models.volunteerapplication.findOne(
    {
      where: {
        email: application.email
      }
    }
  );

  if (existingApplication) {
    throw new Error(`${application.email} has already applied to volunteer`);
  }
  // Creating new VolunteerApplication
  const newApplication = await database.models.volunteerapplication.create({
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    subjectOfStudy: application.subjectOfStudy,
    yearOfStudy: application.yearOfStudy,
    gender: application.gender,
    teams: application.teams,
    reasonToJoin: application.reasonToJoin,
    onlyAvailableAtEvent: application.onlyAvailableAtEvent == "on"
  });

  return newApplication ? newApplication.dataValues : null;
};

// Creates a new CVSubmission
exports.createCVSubmission = async (
  database,
  { email, password, firstName, lastName }
) => {
  // Checking if the user already has a CVSubmission
  const existingSubmission = await database.models.cvsubmission.findOne({
    where: {
      email
    }
  });

  if (existingSubmission) {
    throw new Error(`${email} is already taken`);
  }
  // Creating new VolunteerApplication
  const newSubmission = await database.models.cvsubmission.create({
    firstName,
    lastName,
    email,
    password: miscHelpers.hashPassword(password),
    emailToken: miscHelpers.MakeRandomString(15)
  });

  return newSubmission ? newSubmission.dataValues : null;
};

exports.findCVSubmission = async (database, id) => {
  const submission = await database.models.cvsubmission.findOne({
    where: {
      id
    }
  });

  return submission ? submission.dataValues : null;
};

exports.findCVSubmissionByEmail = async (
  database,
  email,
  emailVerified = true
) => {
  const submission = await database.models.cvsubmission.findOne({
    where: {
      email,
      emailVerified
    }
  });

  return submission ? submission.dataValues : null;
};

exports.findCVSubmissionByEmailAndToken = async (
  database,
  email,
  emailToken,
  emailVerified = true
) => {
  const submission = await database.models.cvsubmission.findOne({
    where: {
      email,
      emailToken,
      emailVerified
    }
  });

  return submission ? submission.dataValues : null;
};

exports.findCVSubmissionByEmailAndPassword = async (
  database,
  email,
  password,
  emailVerified = true
) => {
  const submission = await database.models.cvsubmission.findOne({
    where: {
      email,
      password,
      emailVerified
    }
  });

  return submission ? submission.dataValues : null;
};

exports.updateCVSubmission = async (database, submission, updatedValues) => {
  const updatedRows = await database.models.cvsubmission.update(updatedValues, {
    where: {
      id: submission.id
    }
  });

  return updatedRows;
};

exports.resetPasswordForCVSubmission = async (
  database,
  email,
  emailToken,
  password
) => {
  const updatedRows = await database.models.cvsubmission.update(
    {
      password: miscHelpers.hashPassword(password)
    },
    {
      where: {
        email,
        emailToken
      }
    }
  );

  return updatedRows;
};

exports.verifyCVSubmission = async (database, { email, emailToken }) => {
  const updatedRows = await database.models.cvsubmission.update(
    {
      emailVerified: 1
    },
    {
      where: {
        email,
        emailToken
      }
    }
  );

  return updatedRows;
};

exports.publishCVSubmission = async (database, { submissionStatus, id }) => {
  const updatedRows = await database.models.cvsubmission.update(
    {
      submissionStatus: submissionStatus ? 0 : 1
    },
    {
      where: {
        id: id
      }
    }
  );

  return updatedRows;
};

// Creates a new JobPosting
exports.createJobPosting = async (
  database,
  { position, description, company, location, applyLink, logoLink }
) => {
  try {
    const newPosting = await database.models.jobposting.create({
      position,
      description,
      company,
      location,
      applyLink,
      logoLink
    });

    return newPosting ? newPosting.dataValues : null;
  } catch (err) {
    throw new Error(`Could not create a new job posting: ${err}`);
  }
};

// Gets all JobPostings from database
exports.getJobs = async database => {
  try {
    const jobs = await database.models.jobposting.findAll();

    return jobs ? jobs.map(j => j.dataValues) : [];
  } catch (err) {
    throw new Error(`Could not list jobs: ${err}`);
  }
};

// Creates a new ArticlePosting
exports.createArticlePosting = async (
  database,
  { title, content, date, photoLink }
) => {
  try {
    const newPosting = await database.models.articleposting.create({
      title,
      content,
      date,
      photoLink
    });

    return newPosting ? newPosting.dataValues : null;
  } catch (err) {
    throw new Error(`Could not create a new article posting: ${err}`);
  }
};

// Gets all ArticlePostings from database
exports.getArticles = async database => {
  try {
    const articles = await database.models.articleposting.findAll({
      order: [["date", "DESC"]]
    });

    return articles ? articles.map(a => a.dataValues) : [];
  } catch (err) {
    throw new Error(`Could not list articles: ${err}`);
  }
};
