// // src/routes/api/get.js

// const { createSuccessResponse } = require("../../response");

// /**
//  * Get a list of fragments for the current user
//  */
// module.exports = (req, res) => {
//   const data = {
//     status: "ok",
//     fragments: [],
//   };
//   res.status(200).json(createSuccessResponse(data));
// };

// src/routes/api/get.js
// src/routes/api/get.js
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

    if (!expand) {
      fragments = fragments.map((fragment) => fragment.id);
    }

    res.status(200).json(
      createSuccessResponse({
        fragments: fragments,
      })
    );
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
