// src/routes/index.js

const express = require("express");

// version and author from package.json
const { version, author } = require("../../package.json");

// Create a router that we can use to mount our API
const router = express.Router();

// Our authentication middleware
const { authenticate } = require("../auth");
const { createSuccessResponse } = require("../response");

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, authenticate(), require("./api"));
//router.use("/v1/fragments", authenticate(), fragmentRoutes);

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */

router.get("/", (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader("Cache-Control", "no-cache");

  // Send a 200 'OK' response with info about our repo
  const data = {
    status: "ok",
    author,
    // TODO: change this to use your GitHub username!
    githubUrl: "https://github.com/Dmanoj07/fragments",
    version,
  };
  res.status(200).json(createSuccessResponse(data));
});

module.exports = router;
