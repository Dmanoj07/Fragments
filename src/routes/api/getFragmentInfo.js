const { Fragment } = require("../../model/fragment");
const logger = require("../../logger");
const {
  createSuccessResponse,
  createErrorResponse,
} = require("../../response");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user;

    const fragment = await Fragment.byId(ownerId, id);

    if (!fragment) {
      return res
        .status(404)
        .json(createErrorResponse(404, "Fragment not found"));
    }

    const fragmentInfo = {
      id: fragment.id,
      ownerId: fragment.ownerId,
      created: fragment.created,
      updated: fragment.updated,
      type: fragment.type,
      size: fragment.size,
    };

    res.status(200).json(createSuccessResponse({ fragment: fragmentInfo }));
  } catch (err) {
    logger.error(err);
    res.status(500).json(createErrorResponse(500, err.message));
  }
};
