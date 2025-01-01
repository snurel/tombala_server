import { Socket } from 'socket.io';
import { User } from '../components/User';
import { BaseCommand } from './BaseCommand';
import { PlayerJoinMessage } from '../messages/PlayerJoinMessage';
import { Messages } from '../enums/Messages';
import Logger from '../Utility/Logger';
import { PlayerJoinedMessage } from '../messages/PlayerJoinedMessage';
import { JoinGameInfoMessage } from '../messages/JoinGameInfoMessage';

export class JoinGameCommand extends BaseCommand {
  handle(socket: Socket, user: User, message?: PlayerJoinMessage) {
    Logger.info(
      `Name received: ${JSON.stringify(message)} -> from: ${socket.id}`
    );

    if (!user || !message) {
      return;
    }

    const game = this.gameManager.getGame(Number(message.code));
    if (!game) {
      socket.emit(
        Messages.GameNotFound,
        `Oyun bulunumadı! Kodu (${message.code} kontrol etmelisiniz!)`
      );
      return;
    }

    if (game.isStarted()) {
      socket.emit(
        Messages.AlreadyStarted,
        'Oyun başladı. Bitince tekrar deneyin'
      );
      return;
    }

    user.initPlayer(game.getId());

    const info = game.addPlayer(user);
    this.notifyManager(game.getManager(), user, info);

    const roomId = this.ioManager.getRoomId(game.getId());
    socket.join(roomId);

    socket.emit(Messages.JoinedToGame, info);
  }

  notifyManager(managerId: string, user: User, info: JoinGameInfoMessage) {
    const managerUser = this.userManager.users.get(managerId);
    const joinInfo = {
      name: user.getName(),
      id: user.id,
      info,
    } as PlayerJoinedMessage;
    managerUser?.socket.emit(Messages.NewPlayerJoined, joinInfo);
  }
}
