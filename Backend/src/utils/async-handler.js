import { ApiError } from "./api-error.js";

const asyncHandler = function(requestHandler) {
  return function (req, res, next) {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      const error = new ApiError(500, "Internal Server Error", err);
      res.status(500).json(error);
    });
  };
};

export { asyncHandler };
