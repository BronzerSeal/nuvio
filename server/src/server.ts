import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import "dotenv/config";

const app = express();
const port = 8000;

app.use(
  cors({
    origin: process.env.WEBSITE_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.get("/api/tasks", async (req: express.Request, res: express.Response) => {
  res.json([]);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
