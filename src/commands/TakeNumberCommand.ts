import { Socket } from 'socket.io';
import { Connection } from '../components/Connection';
import { BaseCommand } from './BaseCommand';
import { Messages } from '../enums/Messages';

export class TakeNumberCommand extends BaseCommand {
  handle(socket: Socket, conn?: Connection, message?: any) {
    if (!conn || !conn.admin) {
      return;
    }

    const game = this.gameManager.getGame(conn.admin.getGameId());

    if (!game) {
      return;
    }

    const lucky = game.getNumber();
    const winners = game.checkResult();

    this.ioManager.broadcastToGame(game.getId(), Messages.TakeNumber, {
      lucky,
    });

    if (winners.length > 0) {
      const winnerPlayers = winners.map((w) => w.getName());
      this.ioManager.broadcastToGame(game.getId(), Messages.GameOver, {
        winnerPlayers,
      });
    }
  }
}
