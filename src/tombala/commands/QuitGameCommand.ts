import { Socket } from 'socket.io';
import { Connection } from '../../shared/components/Connection';
import { BaseCommand } from '../../shared/abstractClasses/BaseCommand';
import Logger from '../../shared/utility/Logger';
import { TombalaMessages } from '../enums/Messages';
import { TombalaGameManager } from '../managers/TombalaGameManager';
import { TombalaConnectionManager } from '../managers/TombalaConnectionManager';
import { TombalaConnectionDetails } from './TombalaConnectionDetails';
import { Player } from '../../shared/components/Player';

export class QuitGameCommand extends BaseCommand<
  TombalaGameManager,
  TombalaConnectionManager
> {
  handle(socket: Socket, conn: Connection, message?: any) {
    Logger.info(
      `JoinGame received: ${JSON.stringify(message)} -> from: ${socket.id}`
    );

    if (!conn) {
      return;
    }

    const player = conn.getDetails<TombalaConnectionDetails>()?.player;

    if (!player) {
      return;
    }

    const game = this.gameManager.getGame(player?.getGameId());
    if (!game) {
      return;
    }

    game.removePlayer(player.getId());

    this.ioManager.broadcastToGame(
      game.getId(),
      TombalaMessages.PlayerLeft,
      player.getId()
    );

    const roomId = this.ioManager.getRoomId(game.getId());
    socket.leave(roomId);
  }
}
