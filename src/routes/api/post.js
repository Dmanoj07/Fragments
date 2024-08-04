const contentType = require("content-type");
const { Fragment } = require("../../model/fragment");
const logger = require("../../logger");
const { createErrorResponse } = require("../../response");

module.exports = async (req, res) => {
  try {
    const parsedContentType = contentType.parse(req.headers["content-type"]);

    console.log("Parsed Content-Type:", parsedContentType);

    const type =
      parsedContentType.type +
      (parsedContentType.parameters.charset
        ? `; charset=${parsedContentType.parameters.charset}`
        : "");
    if (!Fragment.isSupportedType(type)) {
      res
        .status(415)
        .json(createErrorResponse(415, "Unsupported Content Type"));
      return;
    }

    let fragmentData1, fragmentDataBuffer1;

    if (typeof req.body === "string") {
      fragmentData1 = req.body;
      fragmentDataBuffer1 = Buffer.from(fragmentData1);
    } else if (Buffer.isBuffer(req.body)) {
      fragmentDataBuffer1 = req.body;
      fragmentData1 = fragmentDataBuffer1.toString("utf-8");
    } else {
      throw new Error("Invalid body, expected string or Buffer");
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

    const location = `${req.protocol}://${req.get("host")}/v1/fragments/${newFragment.id}`;
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
