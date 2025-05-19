import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProlemsSolvedByUser,
  getProblemById,
  updateProblem,
} from "../controllers/problem.controller.js";

const problemRoutes = Router();

problemRoutes.route("/create-problem").post(isAuthenticated, isAdmin, createProblem);
problemRoutes.route("/get-all-problems").get(isAuthenticated, getAllProblems);
problemRoutes.route("/get-problem/:id").get(isAuthenticated, getProblemById);
problemRoutes.route("/update-problem/:id").put(isAuthenticated, isAdmin, updateProblem);
problemRoutes.route("/delete-problem/:id").delete(isAuthenticated, isAdmin, deleteProblem);
problemRoutes.route("/get-solved-problems").get(isAuthenticated, getAllProlemsSolvedByUser);

export default problemRoutes;
