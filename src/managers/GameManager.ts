import { Game } from '../components/Game';

export class GameManager {
  usedCodes: Set<number>;
  games: Map<number, Game>;
  managers: Map<string, number>;

  static instance: GameManager;

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

  createGame(managerId: string): number {
    const id = this.generateUniqueCode();
    const game = new Game(id, managerId);
    this.games.set(id, game);
    this.managers.set(managerId, id);
    return id;
  }

  clearGame(gameId: number, managerId?: string) {
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
}
