import { Socket } from 'socket.io';
import { Connection } from '../../shared/components/Connection';
import { BaseCommand } from '../../shared/abstractClasses/BaseCommand';
import { TombalaGameManager } from '../managers/TombalaGameManager';
import { TombalaConnectionManager } from '../managers/TombalaConnectionManager';
import { TombalaMessages } from '../enums/Messages';
import { TombalaConnectionDetails } from './TombalaConnectionDetails';

export class StartGameCommand extends BaseCommand<
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

    game.startGame();

    this.ioManager.broadcastToGame(game.getId(), TombalaMessages.Start);
  }
}
