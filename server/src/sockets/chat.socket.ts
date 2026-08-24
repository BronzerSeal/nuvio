import { Server, Socket } from "socket.io";

export const registerChatSocket = (io: Server, socket: Socket) => {
  socket.on("join-conversation", (conversationId: string) => {
    socket.join(conversationId);
    console.log("joined conversation:", conversationId);
  });
};
