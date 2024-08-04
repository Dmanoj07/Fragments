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

    let fragment;
    try {
      fragment = await Fragment.byId(ownerId, id);
    } catch (error) {
      // If Fragment.byId throws an error because the fragment wasn't found
      if (error.message.includes("Unable to find id")) {
        return res
          .status(404)
          .json(createErrorResponse(404, "Fragment not found"));
      }
      // If it's any other error, re-throw it to be caught by the outer try-catch
      throw error;
    }

    // If Fragment.byId returns null (which it shouldn't based on your implementation, but just in case)
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

    // if (err.message.include("unable to find")) {
    //   return res
    //     .status(404)
    //     .json(createErrorResponse(404, "fragment not found"));
    // }

    res.setHeader("Content-Type", mimeType);
    res.status(200).send(data);
  } catch (error) {
    logger.error(error);
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
