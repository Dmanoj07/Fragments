// src/routes/api/put.js
const { Fragment } = require("../../model/fragment");
const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../response");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user;
    const newData = req.body;

    // Get the existing fragment
    const fragment = await Fragment.byId(ownerId, id);
    if (!fragment) {
      return res
        .status(404)
        .json(createErrorResponse(404, "Fragment not found"));
    }

    // Check if the Content-Type matches the existing fragment's type
    if (req.get("Content-Type") !== fragment.type) {
      return res
        .status(400)
        .json(
          createErrorResponse(400, "Content-Type does not match fragment type")
        );
    }

    // Update the fragment data
    await fragment.setData(newData);

    // Save the updated fragment
    await fragment.save();

    res.status(200).json(
      createSuccessResponse({
        fragment: {
          id: fragment.id,
          ownerId: fragment.ownerId,
          created: fragment.created,
          updated: fragment.updated,
          type: fragment.type,
          size: fragment.size,
        },
      })
    );
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
