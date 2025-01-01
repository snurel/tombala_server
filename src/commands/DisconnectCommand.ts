import { Socket } from 'socket.io';
import { Connection } from '../components/Connection';
import { BaseCommand } from './BaseCommand';
import { Messages } from '../enums/Messages';
import Logger from '../Utility/Logger';

export class DisconnectCommand extends BaseCommand {
  handle(socket: Socket, conn?: Connection) {
    Logger.info(`Connection lost: ${socket.id}`);
    const id = socket.id.toString();

    this.handlePlayerLeft(conn);
    this.handleManagerLeft(conn);
  }

  handleManagerLeft(conn?: Connection) {
    if (!conn || !conn.admin) {
      return;
    }

    const managedGameId = this.gameManager.managers.get(conn.admin.getId());
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
        Messages.ManagerDisconnected
      );
    }

    this.gameManager.clearGame(managedGameId, conn.admin.getId());
  }

  handlePlayerLeft(conn?: Connection) {
    if (!conn || !conn.player) {
      return;
    }

    const userGame = this.gameManager.getGame(conn.player.getGameId());
    if (!userGame) {
      return;
    }

    if (userGame.isStarted()) {
      return;
    }

    this.connectionManager.connections.delete(conn.id);

    userGame.removePlayer(conn.player.getId());

    this.ioManager.broadcastToGame(
      conn.player.getGameId(),
      Messages.PlayerLeft,
      conn.id
    );
  }
}
