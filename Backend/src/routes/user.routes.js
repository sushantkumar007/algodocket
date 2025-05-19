import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const userRoutes = Router();

userRoutes.route("/register").post(register);
userRoutes.route("/login").post(login);
userRoutes.route("/logout").get(isAuthenticated, logout);
userRoutes.route("/me").get(isAuthenticated, getCurrentUser);

export default userRoutes;
