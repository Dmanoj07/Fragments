// const contentType = require("content-type");
// const { Fragment } = require("../../model/fragment");
// const logger = require("../../logger");
// const { createErrorResponse } = require("../../response");

// module.exports = async (req, res) => {
//   try {
//     const { type, parameters } = contentType.parse(req.headers["content-type"]);
//     const fullType =
//       type + (parameters.charset ? `; charset=${parameters.charset}` : "");

//     if (!Fragment.isSupportedType(fullType)) {
//       return res
//         .status(415)
//         .json(createErrorResponse(415, "Unsupported Content Type"));
//     }

//     if (!req.body || req.body.length === 0) {
//       throw new Error("Empty fragment body");
//     }

//     const fragmentData = Buffer.isBuffer(req.body)
//       ? req.body
//       : Buffer.from(req.body);
//     const fragmentSize = fragmentData.length;

//     logger.debug(
//       {
//         ownerId: req.user,
//         type: fullType,
//         size: fragmentSize,
//         data: fragmentData.toString("utf-8").substring(0, 100), // Log first 100 chars
//       },
//       "Creating new fragment"
//     );

//     const newFragment = new Fragment({
//       ownerId: req.user,
//       type: fullType,
//       size: fragmentSize,
//     });

//     await newFragment.save();
//     await newFragment.setData(fragmentData);

//     const location = `${req.protocol}://${req.get("host")}/v1/fragments/${newFragment.id}`;
//     res.setHeader("Location", location);
//     res.status(201).json({
//       status: "ok",
//       fragment: newFragment,
//     });
//   } catch (err) {
//     logger.error(`Error creating fragment: ${err.message}`);
//     const statusCode = err.message.includes("Unsupported Content Type")
//       ? 415
//       : 400;
//     res.status(statusCode).json(createErrorResponse(statusCode, err.message));
//   }
// };

const contentType = require("content-type");
const { Fragment } = require("../../model/fragment");
const logger = require("../../logger");
const { createErrorResponse } = require("../../response");

const MAX_FRAGMENT_SIZE = 5 * 1024 * 1024; // 5MB

module.exports = async (req, res) => {
  try {
    const contentLength = parseInt(req.get("Content-Length"), 10);
    const { type, parameters } = contentType.parse(req.headers["content-type"]);
    const fullType =
      type + (parameters.charset ? `; charset=${parameters.charset}` : "");

    if (!Fragment.isSupportedType(fullType)) {
      return res
        .status(415)
        .json(createErrorResponse(415, "Unsupported Content Type"));
    }

    if (!req.body || req.body.length === 0) {
      throw new Error("Empty fragment body");
    }

    const fragmentData = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(req.body);
    const fragmentSize = fragmentData.length;

    if (contentLength > MAX_FRAGMENT_SIZE) {
      return res
        .status(413)
        .json(createErrorResponse(413, "Fragment is too large"));
    }

    // Validate JSON content if applicable
    if (fullType === "application/json") {
      try {
        JSON.parse(fragmentData.toString());
      } catch (error) {
        throw new Error("Invalid JSON");
      }
    }

    logger.debug(
      {
        ownerId: req.user,
        type: fullType,
        size: fragmentSize,
        data: fragmentData.toString("utf-8").substring(0, 100), // Log first 100 chars
      },
      "Creating new fragment"
    );

    const newFragment = new Fragment({
      ownerId: req.user,
      type: fullType,
      size: fragmentSize,
    });

    await newFragment.save();
    await newFragment.setData(fragmentData);

    const location = `${req.protocol}://${req.get("host")}/v1/fragments/${newFragment.id}`;
    res.setHeader("Location", location);
    res.status(201).json({
      status: "ok",
      fragment: newFragment,
    });
  } catch (err) {
    logger.error(`Error creating fragment: ${err.message}`);
    let statusCode = 400;
    if (err.message.includes("Unsupported Content Type")) {
      statusCode = 415;
    } else if (err.message.includes("Fragment is too large")) {
      statusCode = 413;
    }
    res.status(statusCode).json(createErrorResponse(statusCode, err.message));
  }
};
