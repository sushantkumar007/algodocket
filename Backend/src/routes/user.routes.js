import { Router } from "express";
import {
  check,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const userRoutes = Router();

userRoutes.route("/register").post(register);
userRoutes.route("/login").post(login);
userRoutes.route("/logout").get(isAuthenticated, logout);
userRoutes.route("/check").get(isAuthenticated, check);

export default userRoutes;
