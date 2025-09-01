import * as AuthRoutes from "./routes.js";
import * as AuthControllers from "./controllers.js";
import { honoApp } from "../../middlewares/honoMiddleware.js";

export const AuthRouter = honoApp();

AuthRouter.openapi(AuthRoutes.signUpRoute, async (c) => {
  const payload = c.req.valid("json");
  const data = await AuthControllers.signUpUser(payload);
  return c.json({
    ok: true,
    message: "User registered successfully",
    data,
  });
});

AuthRouter.openapi(AuthRoutes.signInRoute, async (c) => {
  const payload = c.req.valid("json");
  const data = await AuthControllers.signInUser(payload);
  return c.json({
    ok: true,
    message: "User signed in successfully",
    data,
  });
});
