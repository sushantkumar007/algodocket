import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const extractedArray = [];

  errors.array().forEach((error) => {
    extractedArray.push({
      [error.path]: error.msg,
    });
  });

  res.status(400).json(new ApiError(300, "Invalid data", extractedArray));
};

export { validate };
