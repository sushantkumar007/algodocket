import { db } from "../libs/db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

const createProblem = asyncHandler(async (req, res) => {
  const { id: userId, role } = req.user;
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (role !== "ADMIN") {
    return res
      .status(403)
      .json(new ApiError(403, "You are not allowed to create a problem"));
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageId(language);

    if (!languageId) {
      return res
        .status(400)
        .json(new ApiError(400, `Language ${language} is not supported`));
    }

    const submissions = testcases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));

    const submissionResults = await submitBatch(submissions);

    const tokens = submissionResults.map((res) => res.token);

    const results = await pollBatchResults(tokens);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      
      if (result.status.id !== 3) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              `Testcase ${i + 1} failed for language ${language}`,
            ),
          );
      }
    }
  }

  const problem = await db.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
      userId,
    },
  });
  res
    .status(201)
    .json(
      new ApiResponse(201, true, "Problem created successfully", { problem }),
    );
});

const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await db.problem.findMany();

  if (!problems) {
    return res.status(404).json(new ApiError(404, "No problem found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, true, "Problems fetched successfully", { problems }),
    );
});

const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: {
      id,
    },
  });

  if (!problem) {
    return res.status(404).json(new ApiError(404, "Problem not found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, true, "problem found successfully", { problem }),
    );
});

const updateProblem = asyncHandler(async (req, res) => {
  const { id: problemId } = req.params;
  const { id: userId, role } = req.user;
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;
  
  if (role !== "ADMIN") {
    return res
    .status(403)
    .json(new ApiError(403, "You are not allowed to update a problem"));
  }
  
  const problem = await db.problem.findUnique({
    where: {
      id: problemId,
    },
    select: {
      userId: true,
    },
  });
  
  if (!problem) {
    return res.status(404).json(new ApiError(404, "Problem not found"));
  }
  
  if (userId !== problem.userId) {
    return res
    .status(403)
    .json(new ApiError(403, "You are not allowed to update a problem"));
  }
  
  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageId(language);
    
    const submissions = testcases.map(({ input, output }) => ({
      language_id: languageId,
      source_code: solutionCode,
      stdin: input,
      expected_output: output,
    }));

    const submissionResults = await submitBatch(submissions);

    const tokens = submissionResults.map(({ token }) => token);

    const results = await pollBatchResults(tokens);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      if (result.status.id !== 3) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              `Testcase ${i + 1} faild for ${language} Language`,
            ),
          );
      }
    }
  }

  const updatedProblem = await db.problem.update({
    where: {
      id: problemId,
    },
    data: {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, true, "Problem updated successfully", {
        problem: updatedProblem,
      }),
    );
});

const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: {
      id,
    },
  });

  if (!problem) {
    return res.status(404).json(new ApiError(404, "Problem not found"));
  }

  await db.problem.delete({
    where: { id },
  });

  res
    .status(200)
    .json(new ApiResponse(200, true, "Problem deleted successfully"));
});

const getAllProlemsSolvedByUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const problems = await db.problem.findMany({
    where: {
      solvedBy: {
        some: {
          userId,
        },
      },
    },
    include: {
      solvedBy: {
        where: {
          userId,
        },
      },
    },
  });

  if (!problems) {
    return res.status(404).json(new ApiError(404, "Problems not found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, true, "Problem fetched successsfully", { problems }),
    );
});

export {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProlemsSolvedByUser,
};