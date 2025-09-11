import { OpenAPIHono } from "@hono/zod-openapi";
import packageJson from "@/package.json";
import { Scalar } from "@scalar/hono-api-reference";
export default function configureOpenApi(app: OpenAPIHono) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Finance API",
      version: packageJson.version,
    },
  });
  app.get(
    "/scalar",
    Scalar({
      url: "/api/doc",
      theme: "deepSpace",
      favicon: "/assets/favicon.ico",
    })
  );
}

// export default function configureOpenApi(app: OpenAPIHono) {
//   app.doc("/doc", {
//     openapi: "3.0.0",
//     info: {
//       title: "Finance API",
//       version: packageJson.version,
//     },
//   });

//   app.notFound((c) => {
//     return c.json({ page: "wrong" });
//   });

//   app.onError((err, c) => {
//     return c.json(
//       {
//         success: false,
//         message: err.message || "Internal Server Error",
//       },
//       500
//     );
//   });
//   return app
//     .route("/profile", profile)
//     .route("/register", register)
//     .route("/accounts", accounts)
//     .route("/categories", categories)
//     .route("/transactions", transactions)
//     .route("/summary", summary)
//     .route("/polar", polar);
// }
