"use strict";

const passport = require('passport');
const LocalStrategy = require('passport-local');

const dbHelpers = require('./DbHelpers');
const miscHelpers = require('./MiscHelpers');

module.exports = (database) => {
  passport.serializeUser((submission, done) => {
    done(null, submission.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const submission = await dbHelpers.findCVSubmission(database, id);

      done(null, submission);
    } catch (err) {
      return done(err);
    }
  });

  const strategy = new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      password = miscHelpers.hashPassword(password);
      try {
        const submission = await dbHelpers.findCVSubmissionByEmailAndPassword(database, { email, password });

        if (!submission) {
          return done(null, false, { message: 'Incorrect credentials!' });
        }
        return done(null, submission);
      } catch (err) {
        return done(err);
      }
    }
  );

  passport.use(strategy);

  return passport;
};
