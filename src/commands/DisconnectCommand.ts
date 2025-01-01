import { Socket } from 'socket.io';
import { User } from '../components/User';
import { BaseCommand } from './BaseCommand';
import { Messages } from '../enums/Messages';
import Logger from '../Utility/Logger';

export class DisconnectCommand extends BaseCommand {
  handle(socket: Socket, user?: User) {
    Logger.info(`User disconnected: ${socket.id}`);
    const id = socket.id.toString();

    this.handleGamePlayerLeft(user);
    this.handleManagerLeft(id);
  }

  handleManagerLeft(userId: string) {
    const managedGameId = this.gameManager.managers.get(userId);
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

    this.gameManager.clearGame(managedGameId, userId);
  }

  handleGamePlayerLeft(user?: User) {
    if (!user || !user.gameId) {
      return;
    }

    const userGame = this.gameManager.getGame(user.gameId);
    if (!userGame) {
      return;
    }

    if (userGame.isStarted()) {
      return;
    }

    this.userManager.users.delete(user.id);

    userGame.removePlayer(user.id);

    this.ioManager.broadcastToGame(user.gameId, Messages.PlayerLeft, user.id);
  }
}
