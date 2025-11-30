import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

export const initSocketService = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all origins for now, restrict in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("audio-stream", (data: any) => {
      // TODO: Process audio stream
      console.log("Audio data received", data);
    });

    socket.on("code-update", (data: any) => {
      // Broadcast code update to others in the room
      socket.broadcast.emit("code-update", data);
      console.log("Code update received", data);
    });

    socket.on("terminal-input", (data: any) => {
      // Handle terminal input
      console.log("Terminal input received", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
