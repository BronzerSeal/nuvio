import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import boardRouter from "./routes/board.routes.js";
import companyRouter from "./routes/company.routes.js";
import userRouter from "./routes/user.routes.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.WEBSITE_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/api/board", boardRouter);
app.use("/api/company", companyRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
