import { Server } from "socket.io";
import { registerBoardSocket } from "./board.socket.js";
import { registerScheduleSocket } from "./schedule.socket.js";
import { registerChatSocket } from "./chat.socket.js";

export const registerSockets = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    registerBoardSocket(io, socket);
    registerScheduleSocket(io, socket);
    registerChatSocket(io, socket);
  });
};
