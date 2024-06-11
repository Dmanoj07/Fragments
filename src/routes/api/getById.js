const { Fragment } = require("../../model/fragment");
//const contentType = require('content-type');
const logger = require("../../logger");
const { createErrorResponse } = require("../../response");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user;

    const fragment = await Fragment.byId(ownerId, id);
    logger.info(`Found fragment ${fragment.id} for user ${fragment.ownerId}`);

    if (!fragment) {
      return res.status(404).json({ error: "Fragment not found!" });
    }

    let data = await fragment.getData();
    let mimeType = fragment.type;

    res.setHeader("Content-Type", mimeType);
    res.status(200).json(data);
  } catch (err) {
    logger.error(err);
    const error = createErrorResponse(500, err.message);
    res.status(500).json(error);
  }
};
