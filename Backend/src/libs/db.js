import { PrismaClient } from "../generated/prisma/index.js"

// const globalForPrisma = globalThis;

// globalForPrisma.prisma = globalForPrisma.prisma || new PrismaClient()

// export const db = globalForPrisma.prisma

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

export const db = new PrismaClient()