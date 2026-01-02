import { Server } from "mock-socket";

const mockServer = new Server("ws://localhost:8080");
let counter = 0;
mockServer.on("connection", (socket) => {
  setInterval(() => {
    socket.send(
      JSON.stringify({
        type: "notification",
        message: "Hello from mock server",
        c: `${counter}`,
      })
    );
    counter++;
  }, 2000);
});
export default mockServer;
