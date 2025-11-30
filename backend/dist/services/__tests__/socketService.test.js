import { createServer } from "http";
import Client from "socket.io-client";
import { initSocketService } from "../socketService.js";
describe("SocketService", () => {
    let io;
    let serverSocket;
    let clientSocket;
    let httpServer;
    beforeAll((done) => {
        httpServer = createServer();
        io = initSocketService(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = Client(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });
    afterAll(() => {
        io.close();
        clientSocket.close();
        httpServer.close();
    });
    test("should join a room", (done) => {
        const roomId = "test-room";
        clientSocket.emit("join-room", roomId);
        // Wait for server to process
        setTimeout(() => {
            expect(serverSocket.rooms.has(roomId)).toBe(true);
            done();
        }, 50);
    });
    test("should handle audio-stream event", (done) => {
        const audioData = { chunk: "test-audio" };
        serverSocket.on("audio-stream", (data) => {
            expect(data).toEqual(audioData);
            done();
        });
        clientSocket.emit("audio-stream", audioData);
    });
    test("should handle code-update event", (done) => {
        const codeData = { code: "console.log('hello')", language: "javascript" };
        serverSocket.on("code-update", (data) => {
            expect(data).toEqual(codeData);
            done();
        });
        clientSocket.emit("code-update", codeData);
    });
    test("should handle terminal-input event", (done) => {
        const inputData = { input: "ls" };
        serverSocket.on("terminal-input", (data) => {
            expect(data).toEqual(inputData);
            done();
        });
        clientSocket.emit("terminal-input", inputData);
    });
});
//# sourceMappingURL=socketService.test.js.map