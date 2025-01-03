import { GameAdmin } from '../../tombala/components/GameAdmin';
import { TombalaGame } from '../../tombala/components/TombalaGame';
import { GameManager } from '../../shared/managers/GameManager';

export class TombalaGameManager extends GameManager {
  managers: Map<number, number>;
  managerSockets: Map<number, string>;
  playersSockets: Map<number, string>;

  constructor() {
    super();
    this.managers = new Map();
    this.managerSockets = new Map();
    this.playersSockets = new Map();
  }

  getGame(id: number): TombalaGame | undefined {
    return super.getGame(id) as TombalaGame;
  }

  create(): TombalaGame {
    return super.create() as TombalaGame;
  }

  createGame(gameId: number) {
    const game = new TombalaGame(gameId);

    const admin = new GameAdmin(GameManager.generateId(), gameId);

    game.setManager(admin);

    this.managers.set(admin.getId(), gameId);

    return game;
  }

  storeManagerSocket(managerId: number, socketId: string) {
    this.managerSockets.set(managerId, socketId);
  }

  storePlayerSocket(playerId: number, socketId: string) {
    this.playersSockets.set(playerId, socketId);
  }

  getManagerSocketId(managerId: number) {
    return this.managerSockets.get(managerId);
  }

  getPlayerSocketId(playerId: number) {
    return this.playersSockets.get(playerId);
  }

  clearGame(gameId: number, managerId?: number) {
    super.clear(gameId);
    if (managerId) {
      this.removeManager(managerId);
    }
  }

  removePlayer(pId: number) {
    this.playersSockets.delete(pId);
  }

  removeManager(mId: number) {
    this.managerSockets.delete(mId);
    this.managers.delete(mId);
  }
}
