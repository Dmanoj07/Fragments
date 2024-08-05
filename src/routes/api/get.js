const { Fragment } = require("../../model/fragment");
const {
  createSuccessResponse,
  createErrorResponse,
} = require("../../response");

module.exports = async (req, res) => {
  const ownerId = req.user;
  const expand = req.query.expand === "1";

  try {
    let fragments = await Fragment.byUser(ownerId, expand);
    res.status(200).json(
      createSuccessResponse({
        fragments,
      })
    );
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
