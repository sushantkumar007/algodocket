import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        passsword: hashedPassword,
        role: UserRole.USER,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
    res.cookie("jwt", token, cookieOptions)
    res.status(201).json({
      message: "user created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error("faild to register user")
    res.status(500).json({
      message: "faild to register user"
    })
  }
};

export const login = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      return res.status(401).json({
        message: "invalid email or password"
      })
    }

    const isMatch = await bcrypt.compare(password, user.passsword)

    if (!isMatch) {
      return res.status(401).json({
        message: "invalid email or password"
      })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d"}
    )

    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
    res.cookie("jwt", token, cookieOptions)
    res.status(200).json({
      message: "user logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error("faild to login user")
    res.status(500).json({
      message: "faild to login user"
    })
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt")
    res.status(204).json({
      success: true,
      message: "user logged out successfully"
    })
  } catch (error) {
    console.error("faild to logout user")
    res.status(500).json({
      message: "faild to logout user"
    })
  }
}

export const check = async (req, res) => {
  const {user} = req

  try {
    res.status(200).json({
      success: true,
      message: "user authenticated successfully",
      user
    })
  } catch (error) {
    console.log("Error checking user", error)
    res.status(500).json({
      success: false,
      message: "user authentication failed",
      
    })
  }
}