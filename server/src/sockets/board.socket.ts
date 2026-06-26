import { Server, Socket } from "socket.io";

export const registerBoardSocket = (io: Server, socket: Socket) => {
  socket.on("join-board", (boardId: string) => {
    socket.join(boardId);
    console.log("joined board:", boardId);
  });

  socket.on("board-updated", (boardId: string) => {
    io.to(boardId).emit("board-updated");
    console.log("board-updated");
  });
};
