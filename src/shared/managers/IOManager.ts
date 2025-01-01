import { Server as SocketIOServer } from 'socket.io';
import express from 'express';
import http from 'http';
import { Connection } from '../components/Connection';
import { ConnectionManager } from './ConnectionManager';
import Logger from '../utility/Logger';
import { Messages } from '../abstractClasses/Messages';

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
      Logger.info(`New Connection: ${socket.id}`);

      socket.onAny((arg) => {
        Logger.info('New Message Received >>> ' + arg);
        if (socket.listenerCount(arg) === 0) {
          Logger.warn(`Client Event: ${arg} has no listeners!`);
        }
      });

      const connection = new Connection(socket);
      ConnectionManager.getInstance().addConnection(connection);
      Logger.info(`All Listeners add for Connection: ${socket.id}`);
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
    this.io.to(roomId).emit(command as string, message);
  }
}
