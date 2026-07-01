import { Server, Socket } from "socket.io";

export const registerTimelineSocket = (io: Server, socket: Socket) => {
  socket.on("join-timeline", (timelineId: string) => {
    socket.join(timelineId);
    console.log("joined timeline:", timelineId);
  });
};
