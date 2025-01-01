import { Socket } from 'socket.io';
import { Connection } from '../../shared/components/Connection';
import { BaseCommand } from '../../shared/abstractClasses/BaseCommand';
import { TombalaGame } from '../components/TombalaGame';
import { TombalaMessages } from '../enums/Messages';
import { TombalaGameManager } from '../managers/TombalaGameManager';
import { TombalaConnectionManager } from '../managers/TombalaConnectionManager';
import { TombalaConnectionDetails } from './TombalaConnectionDetails';

export class TakeNumberCommand extends BaseCommand<
  TombalaGameManager,
  TombalaConnectionManager
> {
  handle(socket: Socket, conn?: Connection, message?: any) {
    if (!conn) {
      return;
    }

    const admin = conn.getDetails<TombalaConnectionDetails>().admin;

    if (!admin) {
      return;
    }

    const game = this.gameManager.getGame(admin.getGameId());

    if (!game) {
      return;
    }

    const tombalaGame = game as TombalaGame;

    const lucky = tombalaGame.getNumber();
    const winners = tombalaGame.checkResult();

    this.ioManager.broadcastToGame(game.getId(), TombalaMessages.TakeNumber, {
      lucky,
    });

    if (winners.length > 0) {
      const winnerPlayers = winners.map((w) => w.getName());
      this.ioManager.broadcastToGame(game.getId(), TombalaMessages.GameOver, {
        winnerPlayers,
      });
    }
  }
}
