import { Server as SocketIOServer } from 'socket.io';
import express from 'express';
import http from 'http';
import { UserManager } from './UserManager';
import { User } from '../components/User';
import { Messages } from '../enums/Messages';
import Logger from '../Utility/Logger';

export class IOManager {
  static instance: IOManager;

  static init() {
    if (!this.instance) {
      this.instance = new IOManager();
    }
  }

  io: SocketIOServer;

  constructor() {
    const app = express();
    const server = http.createServer(app);
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*',
      },
    });

    this.io.on('connection', (socket) => {
      const user = new User(socket);
      UserManager.instance.addUser(user);
    });

    const PORT = 5200;
    server.listen(PORT, () => {
      Logger.info(`Server is ready: http://localhost:${PORT}`);
    });
  }

  getRoomId(gameId: number) {
    return `#${gameId}`;
  }

  broadcastToGame(gameId: number, command: Messages, message?: any) {
    this.broadcastToRoom(this.getRoomId(gameId), command, message);
  }

  broadcastToRoom(roomId: string, command: Messages, message?: any) {
    this.io.to(roomId).emit(command, message);
  }
}
