import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "../utils/logger.js";
import { APIException } from "../utils/utils.js";

export const errorHandler = async (err: Error, c: Context) => {
  let status = 500;
  let message = "Internal Server Error";
  let details: unknown = undefined;

  // Handle custom APIException
  if (err instanceof APIException) {
    status = err.status;
    message = err.message;
    details = err.cause;
  }

  // Handle Hono's built-in HTTPException
  else if (err instanceof HTTPException) {
    status = err.status;
    message = err.message || "HTTP Error";
  }

  // Handle generic error with status/message
  else if ((err as any).status && (err as any).message) {
    status = (err as any).status;
    message = (err as any).message;
  }

  // Log error with stack trace
  logger.error(
    `Error ${status}: ${message} | Stack: ${err.stack || "no stack"}`
  );

  return c.json(
    {
      success: false,
      error: {
        message,
        status,
        ...(details ? { details } : {}),
      },
    },
    // cast status to any to satisfy Hono's stricter status type
    { status: status as any }
  );
};
