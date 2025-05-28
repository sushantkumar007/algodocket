import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createTest,
  createUserTestResult,
  deleteTest,
  getAllTestResults,
  getAllTests,
  getTest,
  updateTest,
} from "../controllers/test.controller.js";

const testRoutes = Router();

// Test Routes
testRoutes.route("/create").post(isAuthenticated, createTest);
testRoutes.route("/update").post(isAuthenticated, updateTest);
testRoutes.route("/get-test/:id").get(isAuthenticated, getTest);
testRoutes.route("/get-all-tests").get(isAuthenticated, getAllTests);
testRoutes.route("/delete").post(isAuthenticated, deleteTest);

// Test Result Routes
testRoutes.route("/submit").post(isAuthenticated, createUserTestResult);
testRoutes.route("/get-results").post(isAuthenticated, getAllTestResults);


export default testRoutes;
