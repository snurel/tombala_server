import { Socket } from 'socket.io';
import { User } from '../components/User';
import { BaseCommand } from './BaseCommand';
import { Messages } from '../enums/Messages';

export class TakeNumberCommand extends BaseCommand {
  handle(socket: Socket, user?: User, message?: any) {
    if (!user || !user.managementGameId) {
      return;
    }

    const game = this.gameManager.getGame(user.managementGameId);

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
