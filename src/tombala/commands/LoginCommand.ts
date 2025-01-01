import { Socket } from 'socket.io';
import { Connection } from '../../shared/components/Connection';
import { BaseCommand } from '../../shared/abstractClasses/BaseCommand';
import { InitPlayerMessage } from '../messages/InitPlayerMessage';
import { JoinGameInfoMessage } from '../messages/JoinGameInfoMessage';
import Logger from '../../shared/utility/Logger';
import { User } from '../../shared/components/User';
import { TombalaMessages } from '../enums/Messages';
import { TombalaGameManager } from '../managers/TombalaGameManager';
import { TombalaConnectionManager } from '../managers/TombalaConectionManager';
import { TombalaConnectionDetails } from './TombalaConnectionDetails';

export class LoginCommand extends BaseCommand<
  TombalaGameManager,
  TombalaConnectionManager
> {
  handle(socket: Socket, conn: Connection, message?: InitPlayerMessage) {
    Logger.info(`New Login: ${JSON.stringify(message)} -> from: ${socket.id}`);

    if (!message) {
      return;
    }

    const isBack = this.handleReconnect(socket, message.name);
    if (isBack) {
      this.connectionManager.connections.delete(socket.id);
    } else {
      const user = new User(message.name);
      conn.setUser(user);
      socket.emit(TombalaMessages.NameInitialized, message.name);
    }
  }

  handleReconnect(socket: Socket, userName: string): boolean {
    const lastConnection = this.connectionManager.updateSocket(
      userName,
      socket
    );

    if (!lastConnection) {
      return false;
    }

    const player =
      lastConnection.getDetails<TombalaConnectionDetails>()?.player;

    if (!player) {
      return false;
    }

    const currentGame = this.gameManager.getGame(player.getGameId());

    if (!currentGame || !currentGame.isStarted()) {
      return false;
    }

    const info = {
      gameId: currentGame.getId(),
      color: player.getColor(),
      slots: player.getSlots(),
    } as JoinGameInfoMessage;

    const roomId = this.ioManager.getRoomId(currentGame.getId());
    socket.join(roomId);

    socket.emit(TombalaMessages.Reconnect, info);
    return true;
  }
}
