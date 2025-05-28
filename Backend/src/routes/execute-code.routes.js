import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { executeCode, submitCode } from "../controllers/executeCode.controller.js";

const executionRoute = Router();

executionRoute.route("/execute").post(isAuthenticated, executeCode);
executionRoute.route("/submit").post(isAuthenticated, submitCode);

export default executionRoute;
