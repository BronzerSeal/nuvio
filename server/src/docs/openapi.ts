import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry.js";
import "./routes/index.js";

export const openapi = new OpenApiGeneratorV3(
  registry.definitions,
).generateDocument({
  openapi: "3.0.0",

  info: {
    title: "Nuvio API",
    version: "1.0.0",
    description: "Nuvio backend API documentation",
  },

  servers: [
    {
      url: "http://localhost:8000",
    },
  ],
});
