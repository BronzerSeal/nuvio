import { Server, Socket } from "socket.io";

export const registerAvailabilitySocket = (io: Server, socket: Socket) => {
  socket.on("join-availability", (availabilityId: string) => {
    socket.join(availabilityId);
    console.log("joined availability:", availabilityId);
  });

  socket.on("leave-availability", (availabilityId) => {
    socket.leave(availabilityId);
  });
};
