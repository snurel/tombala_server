import { Socket } from 'socket.io';
import { Connection } from '../../shared/components/Connection';
import { BaseCommand } from '../../shared/abstractClasses/BaseCommand';
import { InitPlayerMessage } from '../messages/InitPlayerMessage';
import { JoinGameInfoMessage } from '../messages/JoinGameInfoMessage';
import Logger from '../../shared/utility/Logger';
import { User } from '../../shared/components/User';
import { TombalaMessages } from '../enums/Messages';
import { TombalaGameManager } from '../managers/TombalaGameManager';
import { TombalaConnectionManager } from '../managers/TombalaConnectionManager';
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

    const isBack = this.handleReconnect(socket, message.name, message.secret);
    if (isBack) {
      this.connectionManager.connections.delete(socket.id);
    } else {
      const user = new User(message.name, message.secret);
      conn.setUser(user);
      socket.emit(TombalaMessages.NameInitialized, message);
    }
  }

  handleReconnect(socket: Socket, userName: string, secret: string): boolean {
    const lastConnection = this.connectionManager.updateSocket(
      userName,
      secret,
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
      playId: player.getId(),
    } as JoinGameInfoMessage;

    const roomId = this.ioManager.getRoomId(currentGame.getId());
    socket.join(roomId);

    socket.emit(TombalaMessages.Reconnect, info);
    return true;
  }
}
