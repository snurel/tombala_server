import { Socket } from 'socket.io';
import { User } from '../components/User';
import { BaseCommand } from './BaseCommand';
import { Messages } from '../enums/Messages';

export class StartGameCommand extends BaseCommand {
  handle(socket: Socket, user?: User, message?: any) {
    if (!user || !user.managementGameId) {
      return;
    }

    const game = this.gameManager.getGame(user.managementGameId);

    if (!game) {
      return;
    }

    game.startGame();

    this.ioManager.broadcastToGame(game.getId(), Messages.Start);
  }
}
