import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";

const createTest = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { problemId, name, description, starttedAt, completedAt } = req.body;

  const existingTest = await db.test.findFirst({
    where: {
      userId,
      name,
    },
  });

  if (existingTest) {
    return res
      .status(400)
      .json(new ApiError(400, "test name already exist, please try new name"));
  }

  const test = await db.test.create({
    data: {
      userId,
      problemId,
      name,
      description,
      starttedAt,
      completedAt,
    },
  });

  if (!test) {
    return res.status(400).json(new ApiError(400, "Failed to create test"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, true, "Test created successfully", { test }));
});

const updateTest = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { testId, problemId, name, description, starttedAt, completedAt } =
    req.body;

  const existingTest = await db.test.findFirst({
    where: {
      userId,
      name,
    },
  });

  if (existingTest) {
    return res
      .status(400)
      .json(new ApiError(400, "test name already exist, please try new name"));
  }

  const test = await db.test.update({
    where: { id: testId },
    data: {
      userId,
      problemId,
      name,
      description,
      starttedAt,
      completedAt,
    },
  });

  if (!test) {
    return res.status(400).json(new ApiError(400, "Failed to update test"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, true, "Test updated successfully", { test }));
});

const getTest = asyncHandler(async (req, res) => {
  const { id: testId } = req.params;

  const test = await db.test.findUnique({
    where: { id: testId },
  });

  if (!test) {
    return res.status(404).json(new ApiError(404, "Test not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, true, "Test found successfully", { test }));
});

const getAllTests = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const tests = await db.test.findMany({
    where: { userId },
  });

  if (!tests) {
    return res.status(404).json(new ApiError(404, "Test not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, true, "Tests found successfully", { tests }));
});

const deleteTest = asyncHandler(async (req, res) => {
  const { testId } = req.body;

  const test = await db.findUnique({
    where: {
      id: testId,
    },
  });

  if (!test) {
    return res.status(404).json(new ApiError(404, "Test not found"));
  }

  await db.test.delete({
    where: { id: testId },
  });

  res.status(200).json(new ApiResponse(200, true, "Test deleted successfully"));
});

const createUserTestResult = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { testId, submissionId } = req.body;

  const existingTestTestResult = await db.userTestResult.findFirst({
    where: {
      testId,
      candidateId: userId,
    },
  });

  if (existingTestTestResult) {
    return res
      .status(400)
      .json(new ApiError(400, "User already submited the test"));
  }

  const newUserTestResult = await db.userTestResult.create({
    data: {
      testId,
      candidateId: userId,
      submission: {
        connect: {
          id: submissionId,
        },
      },
    },
  });

  if (!newUserTestResult) {
    return res
      .status(400)
      .json(new ApiError(400, "Failed to submit test"));
  }

  return res.status(200).json(new ApiResponse(200, true, "Test submited successfully", { result: newUserTestResult}))
});

const getAllTestResults = asyncHandler(async (req, res) => {
    const { testId } = req.body

    const results = db.userTestResult.findMany({
        where: { id: testId }
    })

    if (!results) {
        return res.status(404).json(new ApiError(404, "Results not found"))
    }

    res.status(200).json(new ApiResponse(200, true, "Results found successfully", { results}))
})

export {
    createTest,
    updateTest,
    getTest,
    getAllTests,
    deleteTest,
    createUserTestResult,
    getAllTestResults
}