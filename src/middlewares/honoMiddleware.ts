import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

enum HTTPExceptionType {
  v = "VALIDATION",
  a = "AUTH",
  s = "SERVER",
}

export function honoApp() {
  const app = new OpenAPIHono({
    defaultHook(result) {
      if (!result.success) {
        throw new HTTPException(422, {
          message: "Improperly formatted request",
          cause: {
            type: HTTPExceptionType.v,
            details: result.error,
          },
        });
      }
    },
  });

  app.openAPIRegistry.registerComponent("securitySchemes", "auth", {
    type: "apiKey",
    name: "authorization",
    in: "header",
  });

  return app;
}
