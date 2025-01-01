import { GameAdmin } from '../../tombala/components/GameAdmin';
import { TombalaGame } from '../../tombala/components/TombalaGame';
import { GameManager } from '../../shared/managers/GameManager';

export class TombalaGameManager extends GameManager {
  managers: Map<number, number>;

  constructor() {
    super();
    this.managers = new Map();
  }

  getGame(id: number): TombalaGame | undefined {
    return super.getGame(id) as TombalaGame;
  }

  createGame(gameId: number) {
    const game = new TombalaGame(gameId);

    const admin = new GameAdmin(GameManager.generateId(), gameId);

    this.managers.set(admin.getId(), gameId);

    return game;
  }

  clearGame(gameId: number, managerId?: number) {
    super.clear(gameId);
    if (managerId) {
      this.managers.delete(managerId);
    }
  }
}
