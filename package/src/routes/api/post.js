const contentType = require("content-type");
const { Fragment } = require("../../model/fragment");
const logger = require("../../logger"); // Import the logger module
const { createErrorResponse } = require("../../response");

module.exports = async (req, res) => {
  try {
    const { type } = contentType.parse(req.headers["content-type"]);
    if (!Fragment.isSupportedType(type)) {
      logger.warn(`Unsupported content type: ${type}`);
      throw new Error("Unsupported Content Type");
    }

    const newFragment = new Fragment({
      ownerId: req.user,
      type,
      size: req.body.length,
    });

    await newFragment.save();
    await newFragment.setData(req.body);

    const baseUrl = process.env.API_URL || `http://${req.headers.host}`;
    const location = new URL(
      `/fragments/${newFragment.id}`,
      baseUrl
    ).toString();
    res.setHeader("Location", location);
    res.status(201).json({
      status: "ok",
      fragment: newFragment,
    });
  } catch (err) {
    logger.error(`Error creating fragment: ${err.message}`);
    const error = createErrorResponse(400, err.message);
    res.status(400).json(error);
  }
};
