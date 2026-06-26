import { Server } from "socket.io";
import { registerBoardSocket } from "./board.socket.js";

export const registerSockets = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    registerBoardSocket(io, socket);
  });
};
