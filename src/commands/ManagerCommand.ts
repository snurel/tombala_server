import { Socket } from 'socket.io';
import { Connection } from '../components/Connection';
import { BaseCommand } from './BaseCommand';
import { Messages } from '../enums/Messages';

export class ManagerCommand extends BaseCommand {
  handle(socket: Socket, conn?: Connection, message?: any) {
    const { gameId, admin } = this.gameManager.createGame(conn!.id);
    conn?.initAdmin(admin);
    socket.emit(Messages.Manager, { gameId });

    const roomId = this.ioManager.getRoomId(gameId);
    socket.join(roomId);
  }
}
