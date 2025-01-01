import { Game } from '../components/Game';

export abstract class GameManager {
  usedCodes: Set<number>;
  games: Map<number, Game>;

  private static instance: GameManager;
  static ID_COUNTER = 0;

  static init(manager: GameManager) {
    if (!this.instance) {
      this.instance = manager;
    }
  }

  static getInstance<T extends GameManager>() {
    return this.instance as T;
  }

  static generateId() {
    return ++GameManager.ID_COUNTER;
  }

  constructor() {
    this.games = new Map();
    this.usedCodes = new Set();
  }

  getGame(id: number): Game | undefined {
    return this.games.get(id);
  }

  create<T extends Game>(): T {
    const gameId = this.generateUniqueCode();
    const game = this.createGame(gameId);
    this.games.set(game.getId(), game);
    return game as T;
  }

  clear(gameId: number) {
    this.games.delete(gameId);
  }

  protected abstract createGame(id: number): Game;

  abstract clearGame(gameId: number): void;

  protected generateUniqueCode(): number {
    let code;

    do {
      code = Math.floor(1000 + Math.random() * 9000);
    } while (this.usedCodes.has(code));

    this.usedCodes.add(code);
    return code;
  }
}
