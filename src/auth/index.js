// src/auth/index.js
const logger = require("../logger");

logger.debug(
  {
    AWS_COGNITO_POOL_ID: process.env.AWS_COGNITO_POOL_ID,
    AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
    HTPASSWD_FILE: process.env.HTPASSWD_FILE,
    NODE_ENV: process.env.NODE_ENV,
  },
  "Auth configuration"
);

// Prefer Amazon Cognito
if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  logger.info("Using Cognito authentication");
  module.exports = require("./cognito");
}
// Also allow for an .htpasswd file to be used, but not in production
else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== "production") {
  logger.info("Using Basic authentication");
  module.exports = require("./basic-auth");
}
// In all other cases, we need to stop now and fix our config
else {
  throw new Error("missing env vars: no authorization configuration found");
}
