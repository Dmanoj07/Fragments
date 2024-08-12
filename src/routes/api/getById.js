const { Fragment } = require("../../model/fragment");
const logger = require("../../logger");
const { createErrorResponse } = require("../../response");
const mime = require("mime-types");
const markdown = require("markdown-it")();
const csvtojson = require("csvtojson");
const sharp = require("sharp");
const { htmlToText } = require("html-to-text");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user;

    let baseId, extension, data, mimeType, requestedMimeType;

    const dotIndex = id.lastIndexOf(".");
    if (dotIndex !== -1) {
      baseId = id.substring(0, dotIndex);
      extension = id.substring(dotIndex + 1);
      requestedMimeType = mime.lookup(extension);
    } else {
      baseId = id;
    }

    const fragment = await Fragment.byId(ownerId, baseId);

    logger.info(`Found fragment ${fragment.id} for user ${fragment.ownerId}`);
    data = await fragment.getData();
    mimeType = fragment.type;

    if (extension) {
      if (!Fragment.isSupportedType(requestedMimeType)) {
        return res
          .status(415)
          .json(createErrorResponse(415, "Unsupported Media Type"));
      }

      try {
        const result = await convertType(data, mimeType, requestedMimeType);
        data = result.data;
        mimeType = result.mimeType;
      } catch (error) {
        return res.status(415).json(createErrorResponse(415, error.message));
      }
    }

    res.setHeader("Content-Type", mimeType);
    res.status(200).send(data);
  } catch (err) {
    logger.error(err);
    if (err.message.includes("Unable to find")) {
      return res
        .status(404)
        .json(createErrorResponse(404, "fragment not found"));
    }
    const error = createErrorResponse(500, err.message);
    res.status(500).json(error);
  }
};

async function convertType(fragmentData, originalMimeType, requestedMimeType) {
  const conversionMap = {
    "text/plain": {
      "text/plain": (data) => data,
    },
    "text/markdown": {
      "text/html": () => markdown.render(fragmentData.toString()),
      "text/plain": () => fragmentData.toString(),
    },
    "text/html": {
      "text/html": (data) => data,
      "text/plain": () => htmlToText(fragmentData.toString()),
    },
    "text/csv": {
      "text/csv": (data) => data,
      "text/plain": () => fragmentData.toString(),
      "application/json": async () => {
        const jsonArray = await csvtojson().fromString(fragmentData.toString());
        return JSON.stringify(jsonArray);
      },
    },
    "application/json": {
      "application/json": (data) => data,
      "text/plain": async (data) => {
        const jsonArray = JSON.parse(data.toString());
        return jsonArray
          .map((item) => Object.values(item).join(" "))
          .join("\n");
      },
    },
    "image/png": {
      "image/png": (data) => data,
      "image/jpeg": async () => sharp(fragmentData).toFormat("jpeg").toBuffer(),
      "image/webp": async () => sharp(fragmentData).toFormat("webp").toBuffer(),
      "image/avif": async () => sharp(fragmentData).toFormat("avif").toBuffer(),
      "image/gif": async () => sharp(fragmentData).toFormat("gif").toBuffer(),
    },
    "image/jpeg": {
      "image/png": async () => sharp(fragmentData).toFormat("png").toBuffer(),
      "image/jpeg": (data) => data,
      "image/webp": async () => sharp(fragmentData).toFormat("webp").toBuffer(),
      "image/avif": async () => sharp(fragmentData).toFormat("avif").toBuffer(),
      "image/gif": async () => sharp(fragmentData).toFormat("gif").toBuffer(),
    },
    "image/webp": {
      "image/png": async () => sharp(fragmentData).toFormat("png").toBuffer(),
      "image/jpeg": async () => sharp(fragmentData).toFormat("jpeg").toBuffer(),
      "image/webp": (data) => data,
      "image/avif": async () => sharp(fragmentData).toFormat("avif").toBuffer(),
      "image/gif": async () => sharp(fragmentData).toFormat("gif").toBuffer(),
    },
    "image/avif": {
      "image/png": async () => sharp(fragmentData).toFormat("png").toBuffer(),
      "image/jpeg": async () => sharp(fragmentData).toFormat("jpeg").toBuffer(),
      "image/webp": async () => sharp(fragmentData).toFormat("webp").toBuffer(),
      "image/avif": (data) => data,
      "image/gif": async () => sharp(fragmentData).toFormat("gif").toBuffer(),
    },
    "image/gif": {
      "image/png": async () => sharp(fragmentData).toFormat("png").toBuffer(),
      "image/jpeg": async () => sharp(fragmentData).toFormat("jpeg").toBuffer(),
      "image/webp": async () => sharp(fragmentData).toFormat("webp").toBuffer(),
      "image/avif": async () => sharp(fragmentData).toFormat("avif").toBuffer(),
      "image/gif": (data) => data,
    },
  };

  if (
    conversionMap[originalMimeType] &&
    conversionMap[originalMimeType][requestedMimeType]
  ) {
    return {
      data: await conversionMap[originalMimeType][requestedMimeType](
        fragmentData
      ),
      mimeType: requestedMimeType,
    };
  } else {
    throw new Error("No Possible Conversing");
  }
}
