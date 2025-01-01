import { Socket } from 'socket.io';
import { User } from '../components/User';
import { BaseCommand } from './BaseCommand';
import { Messages } from '../enums/Messages';

export class ManagerCommand extends BaseCommand {
  handle(socket: Socket, user?: User, message?: any) {
    const gameId = this.gameManager.createGame(user!.id);
    user?.initManager(gameId);
    socket.emit(Messages.Manager, { gameId });

    const roomId = this.ioManager.getRoomId(gameId);
    socket.join(roomId);
  }
}
