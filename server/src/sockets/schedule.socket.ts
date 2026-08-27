import { Server, Socket } from "socket.io";

export const registerScheduleSocket = (io: Server, socket: Socket) => {
  socket.on("join-schedule", (companyId: string) => {
    socket.join(`schedule:${companyId}`);

    console.log("joined schedule:", companyId);
  });

  socket.on("leave-schedule", (companyId: string) => {
    socket.leave(`schedule:${companyId}`);
  });
};
