import { PrismaClient } from "@prisma/client";
import config from "#backend/config/index.js";

// Creates Singleton Prisma Client for Development mode
export const prisma = globalThis.prisma || new PrismaClient();

if (config.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
