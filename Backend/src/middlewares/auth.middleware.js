import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { ApiError } from "../utils/api-error.js";
import { generateAccessRefreshToken } from "../utils/generate-access-refresh-token.js";

const getUser = async (id) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        refreshToken: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  } catch (error) {
    throw new ApiError(404, "User not found", error);
  }
};

const isAuthenticated = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      try {
        const user = await getUser(decoded.id);

        req.user = user;
        return next();
      } catch (error) {
        return res.status(404).json(new ApiError(404, "User not found", error));
      }
    } catch (error) {}
  }

  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      try {
        const user = await getUser(decoded.id);
        console.log(`isAuth :: user ${user.refreshToken}`);

        if (refreshToken !== user.refreshToken) {
          return res
            .status(401)
            .json(new ApiError(401, "Session expired. Please log in again"));
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          generateAccessRefreshToken({ id: user.id, email: user.email });

        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            refreshToken: newRefreshToken,
          },
        });

        const cookieOptions = {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        req.user = user;
        res.cookie("accessToken", newAccessToken, cookieOptions);
        res.cookie("refreshToken", newRefreshToken, cookieOptions);
        return next();
      } catch (error) {
        return res
          .status(401)
          .json(new ApiError(401, "Session expired. Please log in again"));
      }
    } catch (error) {}
  }

  res
    .status(err.status)
    .json(new ApiError(401, "Not authenticated. Please log in"));
};

const isAdmin = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message:
          "Forbidden - You do not have permission to access this resource",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "Error checking admin role",
    });
  }
};

export { isAuthenticated, isAdmin };