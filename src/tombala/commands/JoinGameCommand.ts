import { Socket } from 'socket.io';
import { Connection } from '../../shared/components/Connection';
import { BaseCommand } from '../../shared/abstractClasses/BaseCommand';
import { PlayerJoinMessage } from '../messages/PlayerJoinMessage';
import Logger from '../../shared/utility/Logger';
import { PlayerJoinedMessage } from '../messages/PlayerJoinedMessage';
import { JoinGameInfoMessage } from '../messages/JoinGameInfoMessage';
import { TombalaMessages } from '../enums/Messages';
import { TombalaGameManager } from '../managers/TombalaGameManager';
import { TombalaConnectionManager } from '../managers/TombalaConnectionManager';
import { TombalaConnectionDetails } from './TombalaConnectionDetails';

export class JoinGameCommand extends BaseCommand<
  TombalaGameManager,
  TombalaConnectionManager
> {
  handle(socket: Socket, conn: Connection, message?: PlayerJoinMessage) {
    Logger.info(
      `JoinGame received: ${JSON.stringify(message)} -> from: ${socket.id}`
    );

    if (!conn || !message) {
      return;
    }

    const game = this.gameManager.getGame(Number(message.code));
    if (!game) {
      socket.emit(
        TombalaMessages.GameNotFound,
        `Oyun bulunumadı! Kodu (${message.code} kontrol etmelisiniz!)`
      );
      return;
    }

    if (game.isStarted()) {
      socket.emit(
        TombalaMessages.AlreadyStarted,
        'Oyun başladı. Bitince tekrar deneyin'
      );
      return;
    }

    const name = conn.getUserCode();

    if (!name) {
      socket.emit(TombalaMessages.AlreadyStarted, 'Oyuncu bulunamadı!');
      return;
    }

    const player = game.addPlayer(name);

    const details = new TombalaConnectionDetails();
    details.initPlayer(player);
    conn.setDetails(details);

    const infoMessage = {
      gameId: game.getId(),
      slots: player.getSlots(),
      color: player.getColor(),
    } as JoinGameInfoMessage;

    const managerSocketId = this.gameManager.getManagerSocketId(
      game.getManager().getId()
    );

    if (!managerSocketId) {
      Logger.error(
        `JoinGameCommand FAILED! managerSocketId NOT FOUND | socket: ${
          socket.id
        } | gameId: ${game.getId()}`
      );
      return;
    }

    this.notifyManager(managerSocketId, conn, infoMessage);

    const roomId = this.ioManager.getRoomId(game.getId());
    socket.join(roomId);

    socket.emit(TombalaMessages.JoinedToGame, infoMessage);
  }

  notifyManager(
    managerId: string,
    conn: Connection,
    info: JoinGameInfoMessage
  ) {
    const managerCon = this.connectionManager.connections.get(managerId);
    const joinInfo = {
      name: conn.getUserCode(),
      id: conn.getId(),
      info,
    } as PlayerJoinedMessage;
    managerCon?.getSocket().emit(TombalaMessages.NewPlayerJoined, joinInfo);
  }
}
