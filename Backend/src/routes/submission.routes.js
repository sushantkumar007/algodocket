import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionForProblem } from "../controllers/submission.controller.js";

const submissionRoutes = Router()

submissionRoutes.route("/get-all-submissions").get(isAuthenticated, getAllSubmission)
submissionRoutes.route("/get-submission/:problemId").get(isAuthenticated, getSubmissionForProblem)
submissionRoutes.route("/get-submissions-count/:problemId").get(isAuthenticated, getAllTheSubmissionsForProblem)

export default submissionRoutes