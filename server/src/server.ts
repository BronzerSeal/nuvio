import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import boardRouter from "./routes/board.routes.js";
import companyRouter from "./routes/company.routes.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import { Server } from "socket.io";
import { createServer } from "node:http";
import "dotenv/config";
import { registerSockets } from "./sockets/index.js";

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.WEBSITE_URL || "http://localhost:3000",
    credentials: true,
  },
});
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
app.use("/api/task", taskRouter);

//WEBSOCKETS
registerSockets(io);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
