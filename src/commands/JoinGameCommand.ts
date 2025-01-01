import { Socket } from 'socket.io';
import { Connection } from '../components/Connection';
import { BaseCommand } from './BaseCommand';
import { PlayerJoinMessage } from '../messages/PlayerJoinMessage';
import { Messages } from '../enums/Messages';
import Logger from '../Utility/Logger';
import { PlayerJoinedMessage } from '../messages/PlayerJoinedMessage';
import { JoinGameInfoMessage } from '../messages/JoinGameInfoMessage';

export class JoinGameCommand extends BaseCommand {
  handle(socket: Socket, conn: Connection, message?: PlayerJoinMessage) {
    Logger.info(
      `Name received: ${JSON.stringify(message)} -> from: ${socket.id}`
    );

    if (!conn || !message) {
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

    const name = conn.getName();

    if (!name) {
      socket.emit(Messages.AlreadyStarted, 'Oyuncu bulunamadı!');
      return;
    }

    const player = game.addPlayer(name);

    conn.initPlayer(player);

    const infoMessage = {
      gameId: game.getId(),
      slots: player.getSlots(),
      color: player.getColor(),
    } as JoinGameInfoMessage;

    this.notifyManager(game.getManagerId(), conn, infoMessage);

    const roomId = this.ioManager.getRoomId(game.getId());
    socket.join(roomId);

    socket.emit(Messages.JoinedToGame, infoMessage);
  }

  notifyManager(
    managerId: string,
    user: Connection,
    info: JoinGameInfoMessage
  ) {
    const managerUser = this.connectionManager.connections.get(managerId);
    const joinInfo = {
      name: user.getName(),
      id: user.id,
      info,
    } as PlayerJoinedMessage;
    managerUser?.socket.emit(Messages.NewPlayerJoined, joinInfo);
  }
}
