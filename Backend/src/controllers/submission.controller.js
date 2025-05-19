import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";

const getAllSubmission = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const submissions = await db.submission.findMany({
    where: {
      userId,
    },
  });

  if (!submissions) {
    return res.status(404).json(new ApiError(404, "Submissions not found"));
  }

  res.status(200).json(
    new ApiResponse(200, true, "Submissions fetched successfully", {
      submissions,
    }),
  );
});

const getSubmissionForProblem = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { problemId } = req.params;

  const submissions = await db.submission.findMany({
    where: {
      userId,
      problemId,
    },
  });

  if (!submissions) {
    return res.status(404).json(new ApiError(404, "Submissions not found"));
  }

  res.status(200).json(
    new ApiResponse(200, true, "Submission fetched successfully", {
      submissions,
    }),
  );
});

const getAllTheSubmissionsForProblem = asyncHandler(async (req, res) => {
  const { problemId } = req.params;

  const submissions = await db.submission.count({
    where: {
      problemId,
    },
  });

  if (!submissions) {
    return res.status(404).json(new ApiError(404, "Submissions not found"));
  }

  res.status(200).json(
    new ApiResponse(200, true, "Submission fetched successfully", {
      submissions,
    }),
  );
});

export {
    getAllSubmission,
    getSubmissionForProblem,
    getAllTheSubmissionsForProblem
}