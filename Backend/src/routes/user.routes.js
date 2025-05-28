import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
  resetPassword,
  resetPasswordRequest,
  sendEmailVerification,
  updatePassword,
  verify
} from "../controllers/user.controller.js";
import { isAuthenticated,  } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js"
import { registerValidation, loginValidation } from "../validators/index.js"

const userRoutes = Router();

userRoutes.route("/register").post(registerValidation(), validate, register);
userRoutes.route("/login").post(loginValidation(), validate, login);
userRoutes.route("/logout").get(isAuthenticated, logout);
userRoutes.route("/me").get(isAuthenticated, getCurrentUser);
userRoutes.route("/verify/:token").get(verify);
userRoutes.route("/request-verificaion").post(sendEmailVerification);
userRoutes.route("/reset-password-request").post(resetPasswordRequest);
userRoutes.route("/reset-password/:token").post(resetPassword);
userRoutes.route("/update-password").post(isAuthenticated, updatePassword);

export default userRoutes;
