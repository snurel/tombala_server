import { Socket } from 'socket.io';
import { User } from '../components/User';
import { BaseCommand } from './BaseCommand';
import { Messages } from '../enums/Messages';
import Logger from '../Utility/Logger';
import { InitPlayerMessage } from '../messages/InitPlayerMessage';
import { JoinGameInfoMessage } from '../messages/JoinGameInfoMessage';

export class LoginCommand extends BaseCommand {
  handle(socket: Socket, user: User, message?: InitPlayerMessage) {
    Logger.info(`New Login: ${JSON.stringify(message)} -> from: ${socket.id}`);

    if (!message) {
      return;
    }

    const isBack = this.handleReconnect(socket, message.name);
    if (isBack) {
      this.userManager.users.delete(socket.id);
    } else {
      user.setName(message.name);
      socket.emit(Messages.NameInitialized, message.name);
    }
  }

  handleReconnect(socket: Socket, userName: string): boolean {
    const currentUser = this.userManager.updateSocket(userName, socket);
    if (!currentUser) {
      return false;
    }

    if (!currentUser.gameId) {
      return false;
    }

    const currentGame = this.gameManager.getGame(currentUser.gameId);

    if (!currentGame || !currentGame.isStarted()) {
      return false;
    }

    const info = {
      gameId: currentGame.getId(),
      color: currentUser.color,
      slots: currentUser.slots,
    } as JoinGameInfoMessage;

    const roomId = this.ioManager.getRoomId(currentGame.getId());
    socket.join(roomId);

    socket.emit(Messages.Reconnect, info);
    return true;
  }
}
