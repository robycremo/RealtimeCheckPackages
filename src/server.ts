import express from "express";
import http from "http";
import { Server } from "socket.io";
import { NotificationService } from "../notification.service";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const notificationService = new NotificationService(io);
notificationService.startPolling();

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
