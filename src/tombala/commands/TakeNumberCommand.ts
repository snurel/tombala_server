import { Socket } from 'socket.io';
import { Connection } from '../../shared/components/Connection';
import { BaseCommand } from '../../shared/abstractClasses/BaseCommand';
import { TombalaGame } from '../components/TombalaGame';
import { TombalaMessages } from '../enums/Messages';
import { TombalaGameManager } from '../managers/TombalaGameManager';
import { TombalaConnectionManager } from '../managers/TombalaConnectionManager';
import { TombalaConnectionDetails } from './TombalaConnectionDetails';

export class TakeNumberCommand extends BaseCommand<
  TombalaGameManager,
  TombalaConnectionManager
> {
  handle(socket: Socket, conn?: Connection, message?: any) {
    if (!conn) {
      return;
    }

    const admin = conn.getDetails<TombalaConnectionDetails>().admin;

    if (!admin) {
      return;
    }

    const game = this.gameManager.getGame(admin.getGameId());

    if (!game) {
      return;
    }

    const lucky = game.getNumber();
    const winners = game.checkResult();

    this.ioManager.broadcastToGame(game.getId(), TombalaMessages.TakeNumber, {
      lucky,
    });

    if (winners.length === 0) {
      return;
    }

    const winnerPlayers = winners.map((w) => w.getName());

    this.ioManager.broadcastToGame(game.getId(), TombalaMessages.GameOver, {
      winnerPlayers,
    });

    this.removeInactivePlayers(game);
  }

  removeInactivePlayers(game: TombalaGame) {
    const playersShouldRemove = game
      .getPlayers()
      .filter((p) => {
        const socketId = this.gameManager.getPlayerSocketId(p.getId());
        if (!socketId) {
          return true;
        }
        const con = this.connectionManager.connections.get(socketId);
        if (!con) {
          return true;
        }
        const disconnected = con.getSocket().disconnected;
        if (disconnected) {
          this.removeInactivePlayer(socketId, p.getId(), game.getId());
        }

        return disconnected;
      })
      .map((p) => p.getId());

    game.removePlayers(playersShouldRemove);
  }

  removeInactivePlayer(socketId: string, playerId: number, gameId: number) {
    this.connectionManager.connections.delete(socketId);
    this.gameManager.removePlayer(playerId);
    this.ioManager.broadcastToGame(
      gameId,
      TombalaMessages.PlayerLeft,
      playerId
    );
  }
}
