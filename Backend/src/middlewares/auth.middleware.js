import jwt from "jsonwebtoken";
// import {db} from "../libs/db.js"
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - No token provided",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({
        message: "Unauthorized - Invalid token"
    })
  }

  try {
    const user = db.user.findUnique({
        where: {
            id: decoded.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
      })

      if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
      }

      req.user = user
      next()
  } catch (error) {
    console.error("Error authenticating user: ", error)
    res.status(500).json({
        message: "Error authentication user"
    })
  }
};

const isAdmin = async (req, res, next) => {
  const { id: userId } = req.user
  
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId
      },
      select: {
        role: true
      }
    })

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Forbidden - You do not have permission to access this resource"
      })
    }
    next()
  } catch (error) {
    console.error("Error checking admin role:", error)
    res.status(500).json({
      message: "Error checking admin role"
    })
  }
}

export {
  isAuthenticated,
  isAdmin
}