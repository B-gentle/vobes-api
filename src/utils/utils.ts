import { StatusCode } from "hono/utils/http-status";
import { ZodType } from "zod";
import { z } from "@hono/zod-openapi";

export class APIException extends Error {
  message: string;
  cause?: any;
  status: StatusCode | number;

  constructor(status: StatusCode | number, message: string, cause?: any) {
    super(message, cause);
    this.cause = cause ? cause : undefined;
    this.message = message;
    this.status = status ? status : 500;

    Error.captureStackTrace(this, APIException);
  }

  public getResponse() {
    return {
      ok: false,
      message: this.message,
      cause: this.cause,
    };
  }
}

export function convertToPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export function genericBodyRequest<TData extends ZodType>(schema: TData) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description: "Request Body",
  };
}

export function defaultSuccessResponse<TData extends ZodType>(
  data?: TData,
  message: string = "Request successful"
) {
  if (data) {
    return {
      content: {
        "application/json": {
          schema: z.object({
            ok: z.boolean().openapi({ example: true }),
            msg: z.string().openapi({ example: message }),
            data,
          }),
        },
      },
      description: "Success Response",
    };
  }

  return {
    content: {
      "application/json": {
        schema: z.object({
          ok: z.boolean().openapi({ example: true }),
          msg: z.string().openapi({ example: message }),
        }),
      },
    },
    description: "Success Response",
  };
}

export function genericErrorResponse(message: string, description: string) {
  return {
    content: {
      "application/json": {
        schema: z
          .object({
            ok: z.boolean(),
            message: z.string(),
          })
          .openapi({
            example: {
              ok: false,
              message,
            },
          }),
      },
    },
    description,
  };
}

export function malformedErrorResponse() {
  return {
    content: {
      "application/json": {
        schema: z
          .object({
            ok: z.boolean(),
            message: z.string(),
            cause: z.array(z.object({ path: z.string(), message: z.string() })),
          })
          .openapi({
            example: {
              ok: false,
              message: "Malformed Entity in Request Payload",
              cause: [{ path: "name", message: "name is required" }],
            },
          }),
      },
    },
    description: "Malformed Entity Error",
  };
}

export function genericGetResponse<TData extends ZodType>(data: TData) {
  return z.object({
    total: z.number().openapi({ example: 100 }),
    count: z.number().openapi({ example: 10 }),
    data: z.array(data),
  });
}
