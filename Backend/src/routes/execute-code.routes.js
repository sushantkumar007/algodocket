import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";

const executionRoute = Router();

executionRoute.route("/").post(isAuthenticated, executeCode);

export default executionRoute;
