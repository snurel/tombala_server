import { Game } from '../components/Game';
import { GameAdmin } from '../components/GameAdmin';

export class GameManager {
  usedCodes: Set<number>;
  games: Map<number, Game>;
  managers: Map<number, number>;

  static instance: GameManager;
  static ID_COUNTER = 0;

  static init() {
    if (!this.instance) {
      this.instance = new GameManager();
    }
  }

  constructor() {
    this.games = new Map();
    this.usedCodes = new Set();
    this.managers = new Map();
  }

  getGame(id: number): Game | undefined {
    return this.games.get(id);
  }

  createGame(managerId: string): { gameId: number; admin: GameAdmin } {
    const gameId = this.generateUniqueCode();
    const game = new Game(gameId, managerId);

    const admin = new GameAdmin(GameManager.generateId(), gameId);

    this.games.set(gameId, game);
    this.managers.set(admin.getId(), gameId);
    return {
      gameId,
      admin,
    };
  }

  clearGame(gameId: number, managerId?: number) {
    this.games.delete(gameId);
    if (managerId) {
      this.managers.delete(managerId);
    }
  }

  private generateUniqueCode(): number {
    let code;

    do {
      code = Math.floor(1000 + Math.random() * 9000);
    } while (this.usedCodes.has(code));

    this.usedCodes.add(code);
    return code;
  }

  static generateId() {
    return ++GameManager.ID_COUNTER;
  }
}
