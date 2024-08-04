// src/auth/basic-auth.js

// Configure HTTP Basic Auth strategy for Passport, see:
// https://github.com/http-auth/http-auth-passport

// const auth = require("http-auth");
// //const passport = require("passport");
// const authPassport = require("http-auth-passport");
// const authorize = require("./auth-middleware");
// const logger = require("../logger");

// if (!process.env.HTPASSWD_FILE) {
//   throw new Error("missing expected env var: HTPASSWD_FILE");
// }
// logger.info("HTPASSWD_FILE:", process.env.HTPASSWD_FILE);
// module.exports.strategy = () =>
//   // For our Passport authentication strategy, we'll look for a
//   // username/password pair in the Authorization header.
//   authPassport(
//     auth.basic({
//       file: process.env.HTPASSWD_FILE,
//     })
//   );

// // Now we'll delegate the authorization to our authorize middleware
// module.exports.authenticate = () => authorize("http");

// src/auth/basic-auth.js

// Configure HTTP Basic Auth strategy for Passport, see:
// https://github.com/http-auth/http-auth-passport

const auth = require("http-auth");
const passport = require("passport");
const authPassport = require("http-auth-passport");
const logger = require("../logger");

// We expect HTPASSWD_FILE to be defined.
if (!process.env.HTPASSWD_FILE) {
  throw new Error("missing expected env var: HTPASSWD_FILE");
}

logger.debug(`Using HTPASSWD file: ${process.env.HTPASSWD_FILE}`);
module.exports.strategy = () =>
  // For our Passport authentication strategy, we'll look for a
  // username/password pair in the Authorization header.
  authPassport(
    auth.basic({
      file: process.env.HTPASSWD_FILE,
    })
  );
module.exports.authenticate = () =>
  passport.authenticate("http", { session: false });
