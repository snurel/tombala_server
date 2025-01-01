import { Socket } from 'socket.io';
import { Connection } from '../components/Connection';
import { BaseCommand } from './BaseCommand';
import { Messages } from '../enums/Messages';

export class StartGameCommand extends BaseCommand {
  handle(socket: Socket, conn?: Connection, message?: any) {
    if (!conn || !conn.admin) {
      return;
    }

    const game = this.gameManager.getGame(conn.admin.getGameId());

    if (!game) {
      return;
    }

    game.startGame();

    this.ioManager.broadcastToGame(game.getId(), Messages.Start);
  }
}
