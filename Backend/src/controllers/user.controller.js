import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { generateAccessRefreshToken } from "../utils/generate-access-refresh-token.js";

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

  const hashedPassword = await bcrypt.hash(password, process.env.PASSWORD_SALT);

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: UserRole.USER,
    },
  });

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
  res.status(200).json(new ApiResponse(200, true, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { user } = req;

  res.status(200).json(
    new ApiResponse(200, true, "Successfully retrieved the current user", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    }),
  );
});

export { register, login, logout, getCurrentUser };
