const { Fragment } = require("../../model/fragment");
const { createErrorResponse } = require("../../response");
const logger = require("../../logger");
const { createSuccessResponse } = require("../../response");

module.exports = async (req, res) => {
  const ownerId = req.user;
  const fragmentId = req.params.id;

  try {
    // Check if the fragment exists before attempting to delete it
    const fragment = await Fragment.byId(ownerId, fragmentId);

    if (!fragment) {
      res.status(404).json(createErrorResponse(404, "Fragment not found"));
      return;
    }

    // Delete the fragment
    await Fragment.delete(ownerId, fragmentId);

    res
      .status(200)
      .json(
        createSuccessResponse({ message: "Fragment deleted successfully" })
      );
  } catch (error) {
    logger.error(
      `Error deleting fragment with ID ${fragmentId}: ${error.message}`
    );
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
