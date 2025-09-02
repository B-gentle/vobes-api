import * as AuthRoutes from "./routes.js";
import * as AuthControllers from "./controllers.js";
import { honoApp } from "../../middlewares/honoMiddleware.js";

export const AuthRouter = honoApp();

AuthRouter.openapi(AuthRoutes.signUpRoute, async (c) => {
  const payload = c.req.valid("json");
  const data = await AuthControllers.signUpUser(payload);
  return c.json(
    {
      ok: true,
      msg: "User registered successfully",
      data,
    },
    201
  );
});

AuthRouter.openapi(AuthRoutes.signInRoute, async (c) => {
  const payload = c.req.valid("json");
  const data = await AuthControllers.signInUser(payload);
  return c.json(
    {
      ok: true,
      msg: "User signed in successfully",
      data,
    },
    200
  );
});

AuthRouter.openapi(AuthRoutes.signInRoute, async (c) => {
  const payload = c.req.valid("json");
  const data = await AuthControllers.signInUser(payload);
  return c.json(
    {
      ok: true,
      msg: "User signed in successfully",
      data,
    },
    200
    );
});
