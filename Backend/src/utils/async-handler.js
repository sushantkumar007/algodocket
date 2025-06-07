import { ApiError } from "./api-error.js";

const asyncHandler = function(requestHandler) {
  return function (req, res, next) {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      res.status(500).json(new ApiError(500, "Internal Server Error", error));
    });
  };
};

export { asyncHandler };
