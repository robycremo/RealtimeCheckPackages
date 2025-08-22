import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const setupSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on('connection', (socket) => {
    console.log('🟢 Client connesso:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔴 Client disconnesso:', socket.id);
    });
  });
};

export const notifyClients = () => {
  if (io) {
    io.emit('expectedPackagesUpdated');
    console.log('📡 Notifica inviata ai client WebSocket');
  }
};
