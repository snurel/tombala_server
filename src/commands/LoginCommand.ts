import { Socket } from 'socket.io';
import { Connection } from '../components/Connection';
import { BaseCommand } from './BaseCommand';
import { Messages } from '../enums/Messages';
import Logger from '../Utility/Logger';
import { InitPlayerMessage } from '../messages/InitPlayerMessage';
import { JoinGameInfoMessage } from '../messages/JoinGameInfoMessage';

export class LoginCommand extends BaseCommand {
  handle(socket: Socket, conn: Connection, message?: InitPlayerMessage) {
    Logger.info(`New Login: ${JSON.stringify(message)} -> from: ${socket.id}`);

    if (!message) {
      return;
    }

    const isBack = this.handleReconnect(socket, message.name);
    if (isBack) {
      this.connectionManager.connections.delete(socket.id);
    } else {
      conn.setName(message.name);
      socket.emit(Messages.NameInitialized, message.name);
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

    if (!lastConnection.player) {
      return false;
    }

    const player = lastConnection.player;

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

    socket.emit(Messages.Reconnect, info);
    return true;
  }
}
