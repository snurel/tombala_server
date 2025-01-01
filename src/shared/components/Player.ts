export class Player {
  private gameId: number;
  private id: number;
  private name: string;

  private connectionId?: string;

  constructor(id: number, name: string, gameId: number) {
    this.id = id;
    this.name = name;
    this.gameId = gameId;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getGameId(): number {
    return this.gameId;
  }

  setConnectionId(conId: string) {
    this.connectionId = conId;
  }

  getConnectionId(): string | undefined {
    return this.connectionId;
  }
}
