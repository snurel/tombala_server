export class GameAdmin {
  private id: number;
  private gameId: number;

  constructor(id: number, gameId: number) {
    this.id = id;
    this.gameId = gameId;
  }

  getId(): number {
    return this.id;
  }

  getGameId(): number {
    return this.gameId;
  }
}
