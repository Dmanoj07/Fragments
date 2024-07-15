// src/routes/api/getById.js
const { Fragment } = require("../../model/fragment");
const logger = require("../../logger");
const { createErrorResponse } = require("../../response");
const mime = require("mime-types");
const markdown = require("markdown-it")();

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user;

    let fragment = await Fragment.byId(ownerId, id);

    if (!fragment) {
      return res
        .status(404)
        .json(createErrorResponse(404, "Fragment not found"));
    }

    let data = await fragment.getData();
    let mimeType = fragment.type;

    // Check if there's an extension in the id
    const idParts = id.split(".");
    if (idParts.length > 1) {
      const requestedExtension = idParts.pop();
      const requestedMimeType = mime.lookup(requestedExtension);

      if (!requestedMimeType) {
        return res
          .status(415)
          .json(createErrorResponse(415, "Unsupported Media Type"));
      }

      // Handle conversion
      if (
        fragment.type === "text/markdown" &&
        requestedMimeType === "text/html"
      ) {
        data = markdown.render(data.toString());
        mimeType = "text/html";
      } else if (fragment.type !== requestedMimeType) {
        return res
          .status(415)
          .json(createErrorResponse(415, "Unsupported conversion"));
      }
    }

    res.setHeader("Content-Type", mimeType);
    res.status(200).send(data);
  } catch (error) {
    logger.error(error);
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
