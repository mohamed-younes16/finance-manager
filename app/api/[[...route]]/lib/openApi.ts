import { OpenAPIHono } from "@hono/zod-openapi";
import packageJson from "@/package.json";
export default function configureOpenApi(app: OpenAPIHono) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Finance API",
      version: packageJson.version,
    },
  });
}
