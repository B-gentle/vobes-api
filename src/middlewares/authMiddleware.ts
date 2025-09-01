import bcrypt from "bcryptjs";
import { env } from "../commons/env.js";
import { sign, verify } from "hono/jwt";
import { Context, Next } from "hono";
import { APIException } from "../utils/utils.js";
import { prisma } from "../config/db.js";
import { logger } from "../utils/logger.js";
import { constants } from "../commons/constants.js";

/**
 * Hash a plain text password.
 */
export const hashPassword = async (plain: string) => {
  const hashed = await bcrypt.hash(plain, constants.saltFactor);
  return hashed;
};

/**
 * Compare a plain text password with a hashed password.
 */
export const comparePasswords = async (plain: string, hashed: string) => {
  const match = await bcrypt.compare(plain, hashed);
  return match;
};

/**
 * Sign a JWT token.
 */
export const signToken = async (params: { userId: string; role: string }) => {
  const payload = {
    userId: params.userId,
    role: params.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 24 hours
  };
  const token = await sign(payload, env.JWT_SECRET);
  return token;
};

/**
 * Verify token
 */
export const verifyToken = async (token: string) => {
  const payload = await verify(token, env.JWT_SECRET);
  return payload;
};

/**
 * Authenticate user
 */
export const authenticateUser = async (c: Context, next: Next) => {
  try {
    const token = c.req.header("Authorization");
    if (!token) {
      throw new APIException(401, "Unauthorized", "Missing or invalid token");
    }
    const payload = await verifyToken(token);
    if (!payload) {
      throw new APIException(401, "Unauthorized", "Invalid or expired token");
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });

    if (!user) {
      throw new APIException(401, "Unauthorized", "User not found");
    }

    c.set("user", user);
    logger.info(`Authenticated user: ${user.email}`);
    await next();
  } catch (error) {
    if (error instanceof APIException) throw error;
    logger.error(
      `Something went wrong: ${error instanceof Error ? error.stack || error.message : String(error)}`
    );
    throw new APIException(401, "Unauthorized", "Authentication failed");
  }
};
