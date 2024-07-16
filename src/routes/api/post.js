const contentType = require("content-type");
const { Fragment } = require("../../model/fragment");
const logger = require("../../logger");
const { createErrorResponse } = require("../../response");

module.exports = async (req, res) => {
  try {
    const { type } = contentType.parse(req.headers["content-type"]);
    if (!Fragment.isSupportedType(type)) {
      logger.warn(`Unsupported content type: ${type}`);
      throw new Error("Unsupported Content Type");
    }

    if (!Buffer.isBuffer(req.body)) {
      throw new Error("Invalid body, expected Buffer");
    }

    if (req.body.length === 0) {
      throw new Error("Empty fragment body");
    }

    // Get the JSON data from the request body
    const fragmentData = req.body.toString("utf-8");
    //console.log(fragmentData);
    // Calculate the size of the fragment
    const fragmentDataBuffer = Buffer.from(fragmentData, "utf-8");
    //console.log(fragmentDataBuffer);
    const fragmentSize = Buffer.byteLength(fragmentDataBuffer);

    console.log(
      {
        ownerId: req.user,
        type,
        size: fragmentSize,
        data: req.body.toString("utf-8").substring(0, 100), // Log first 100 chars
      },
      "Creating new fragment"
    );

    const newFragment = new Fragment({
      ownerId: req.user,
      type,
      size: fragmentSize,
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
