import { createRoute } from "@hono/zod-openapi";
import {
  authRes,
  signInUserSchema,
  signUpUserSchema,
} from "./schemas/index.js";
import {
  defaultSuccessResponse,
  genericBodyRequest,
  genericErrorResponse,
  malformedErrorResponse,
} from "../../utils/utils.js";

const TAG = "Super Admin";

export const signUpRoute = createRoute({
  method: "post",
  path: "/users/signup",
  request: {
    body: genericBodyRequest(signUpUserSchema),
  },
  responses: {
    200: defaultSuccessResponse(authRes),
    400: genericErrorResponse(
      "User already exists",
      "The email is already in use"
    ),
    422: malformedErrorResponse(),
    500: genericErrorResponse(
      "Internal Server Error",
      "An unexpected error occurred"
    ),
  },
  tags: [TAG],
});

export const signInRoute = createRoute({
  method: "post",
  path: "/users/signin",
  request: {
    body: genericBodyRequest(signInUserSchema),
  },
  responses: {
    200: defaultSuccessResponse(authRes),
    400: genericErrorResponse(
      "Invalid email or password",
      "The email or password is incorrect"
    ),
    422: malformedErrorResponse(),
    500: genericErrorResponse(
      "Internal Server Error",
      "An unexpected error occurred"
    ),
  },
  tags: [TAG],
});
