import { honoApp } from './src/middlewares/honoMiddleware.js'
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { openApiConfig } from './src/commons/constants.js';
import { Hono } from 'hono';
import { logger } from './src/utils/logger.js';
import { services } from './src/services/index.js';
import { errorHandler } from './src/middlewares/errorMiddleware.js';

// const app = new Hono()
const app = honoApp()

app.use(cors());
app.use(honoLogger());
app.onError(errorHandler);

app.doc("/doc", openApiConfig);

app.get("/ui", swaggerUI({ url: "/doc" }));

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/hono'
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

app.route("/api", services);

app.notFound((c) => {
  logger.info(`404 Not Found: ${c.req.url}`);
  return c.json({ message: "Not Found" }, 404);
});

export default app
