import { Server } from "socket.io";
export const initSocketService = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Allow all origins for now, restrict in production
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });
        socket.on("audio-stream", (data) => {
            // TODO: Process audio stream
            console.log("Audio data received", data);
        });
        socket.on("code-update", (data) => {
            // Broadcast code update to others in the room
            socket.broadcast.emit("code-update", data);
            console.log("Code update received", data);
        });
        socket.on("terminal-input", (data) => {
            // Handle terminal input
            console.log("Terminal input received", data);
        });
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
    return io;
};
//# sourceMappingURL=socketService.js.map