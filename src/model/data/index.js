// src/model/data/index.js

// If the environment sets an AWS Region, we'll use AWS backend
// services (S3, DynamoDB); otherwise, we'll use an in-memory db.
const logger = require("../../logger");
logger.info(process.env.AWS_REGION);
module.exports = process.env.AWS_REGION
  ? require("./aws")
  : require("./memory");
