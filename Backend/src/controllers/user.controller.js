import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { generateAccessRefreshToken } from "../utils/generate-access-refresh-token.js";
import crypto from "crypto";
import sendMail, {
  emailVerificationBody,
  resetPasswordBody,
} from "../utils/email.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json(new ApiError(400, "User alredy exist"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 20 * 60 * 1000);

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: UserRole.USER,
      emailVerificationToken: token,
      emailVerificationExpiry: expiry,
    },
  });

  if (!user) {
    return res.status(400).json(new ApiError(400, "failed to register user"));
  }

  const emailVerificationLink = `${process.env.BASE_URL}:${process.env.PORT}/api/v1/users/verify/${token}`;

  const { html, text } = emailVerificationBody(name, emailVerificationLink);
  const sendMailOptions = {
    to: email,
    subject: "Please verify your email",
    html,
    text,
  };
  await sendMail(sendMailOptions);

  res.status(201).json(
    new ApiResponse(201, true, "User created successfully", {
      id: user.id,
      email: user.email,
    }),
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json(new ApiError(401, "Invalid email or password"));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json(new ApiError(401, "Invalid email or password"));
  }

  const { accessToken, refreshToken } = generateAccessRefreshToken({
    id: user.id,
    email: user.email,
  });

  await db.user.update({
    where: {
      email,
    },
    data: {
      refreshToken,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(200).json(new ApiResponse(200, true, "Login successful"));
});

const logout = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: null,
    },
  });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res
    .status(200)
    .json(new ApiResponse(200, true, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { user } = req;

  res.status(200).json(
    new ApiResponse(200, true, "Successfully retrieved the current user", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }),
  );
});

const verify = asyncHandler(async (req, res) => {
  const { token: emailVerificationToken } = req.params;

  const user = await db.user.findFirst({
    where: {
      emailVerificationToken,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(400).json(new ApiError(400, "invalid or exprird link"));
  }

  if (user.emailVerificationExpiry < new Date()) {
    return res
      .status(400)
      .json(new ApiError(400, "link expired please try again"));
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    },
  });

  res.status(200).json(new ApiResponse(200, true, "email verifid", { user }));
});

const sendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
      isEmailVerified: true,
    },
  });

  if (!user) {
    return res.status(400).json(new ApiError(400, "invalid email"));
  }

  if (user.isEmailVerified) {
    return res.status(400).json(new ApiError(400, "email is already verified"));
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 20 * 60 * 1000);

  await db.user.update({
    where: {
      email,
    },
    data: {
      emailVerificationToken: token,
      emailVerificationExpiry: expiry,
    },
  });

  const emailVerificationLink = `${process.env.BASE_URL}:${process.env.PORT}/api/v1/users/verify/${token}`;
  const { html, text } = emailVerificationBody(
    user.name,
    emailVerificationLink,
  );

  const sendMailOptions = {
    to: email,
    subject: "Email Verification",
    html,
    text,
  };

  await sendMail(sendMailOptions);

  res
    .status(200)
    .json(
      new ApiResponse(200, true, "email verification link send successfully"),
    );
});

const resetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json(new ApiError(400, "Invalid email"));
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  await db.user.update({
    where: { email },
    data: {
      passwordResetToken: token,
      passwordResetExpiry: expiry,
    },
  });

  const resetPasswordLink = `${process.env.BASE_URL}:${process.env.PORT}/api/v1/users/reset-password/${token}`;

  const { html, text } = resetPasswordBody(user.name, resetPasswordLink);
  const sendMailOptions = {
    to: email,
    subject: "reset your password",
    html,
    text,
  };
  await sendMail(sendMailOptions);

  res
    .status(200)
    .json(new ApiResponse(200, true, "reaset password email send succssfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token: passwordResetToken } = req.params;
  const { password } = req.body;

  const user = await db.user.findFirst({
    where: { passwordResetToken },
    select: {
      email: true,
      passwordResetToken: true,
      passwordResetExpiry: true,
    },
  });

  if (!user) {
    return res.status(400).json(new ApiError(400, "Invalid or expired link"));
  }

  if (user.passwordResetExpiry < new Date()) {
    return res.status(400).json(new ApiError(400, "Invalid or expired link"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { email: user.email },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, true, "Password changed successfully"));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  console.log("updatePassword :: userId ", userId)
  console.log("updatePassword :: oldPassword ", oldPassword)
  console.log("updatePassword :: newPassword ", newPassword)
  
  const user = await db.user.findFirst({
    where: { id: userId },
    select: {
      email: true,
      password: true,
    },
  });
  console.log("updatePassword :: user ", user)
  
  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  console.log("updatePassword :: isPasswordMatch ", isPasswordMatch)
  
  if (!isPasswordMatch) {
    return res
      .status(400)
      .json(new ApiError(400, "wrong password"));
  }

  if (!user) {
    return res
      .status(400)
      .json(new ApiError(400, "update password request failid"));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { email: user.email },
    data: {
      password: hashedPassword,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, true, "Password updated successfully"));
});

export {
  register,
  login,
  logout,
  getCurrentUser,
  verify,
  sendEmailVerification,
  resetPasswordRequest,
  resetPassword,
  updatePassword,
};

// console.log(`Testcase #${i + 1}`);
// console.log(`input ${stdin[i]}`);
// console.log(`Expected Output for testcase ${expected_output}`);
// console.log(`Actual output ${stdout}`);
// console.log(`Matched: ${passed
