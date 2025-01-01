import { Socket } from 'socket.io';
import { Connection } from '../../shared/components/Connection';
import { BaseCommand } from '../../shared/abstractClasses/BaseCommand';
import Logger from '../../shared/utility/Logger';
import { TombalaMessages } from '../enums/Messages';
import { TombalaGameManager } from '../managers/TombalaGameManager';
import { TombalaConnectionManager } from '../managers/TombalaConnectionManager';
import { TombalaConnectionDetails } from './TombalaConnectionDetails';

export class DisconnectCommand extends BaseCommand<
  TombalaGameManager,
  TombalaConnectionManager
> {
  handle(socket: Socket, conn?: Connection) {
    Logger.info(`Connection lost: ${socket.id}`);
    const id = socket.id.toString();

    const details = conn?.getDetails<TombalaConnectionDetails>();

    if (!details) {
      return;
    }

    this.handlePlayerLeft(details, id);
    this.handleManagerLeft(details);
  }

  handleManagerLeft(details: TombalaConnectionDetails) {
    if (!details.admin) {
      return;
    }

    const managedGameId = this.gameManager.managers.get(details.admin.getId());
    if (!managedGameId) {
      return;
    }

    const managedGame = this.gameManager.getGame(managedGameId);

    if (managedGame) {
      managedGame.killGame();

      Logger.info(
        `Disconnected user was manager, ${managedGameId} game killed!`
      );
      this.ioManager.broadcastToGame(
        managedGame.getId(),
        TombalaMessages.ManagerDisconnected
      );
    }

    this.gameManager.clearGame(managedGameId, details.admin.getId());
  }

  handlePlayerLeft(details: TombalaConnectionDetails, conId: string) {
    if (!details?.player) {
      return;
    }

    const player = details.player;

    const userGame = this.gameManager.getGame(player.getGameId());
    if (!userGame) {
      return;
    }

    if (userGame.isStarted()) {
      return;
    }

    this.connectionManager.connections.delete(conId);

    userGame.removePlayer(player.getId());

    this.ioManager.broadcastToGame(
      player.getGameId(),
      TombalaMessages.PlayerLeft,
      player.getId()
    );
  }
}
