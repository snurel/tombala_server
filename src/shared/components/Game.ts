import { GameState } from '../../tombala/enums/GameState';

export abstract class Game {
  protected id: number;
  protected gameState: GameState;

  constructor(id: number) {
    this.id = id;
    this.gameState = GameState.NOT_STARTED;
  }

  getId(): number {
    return this.id;
  }

  isStarted(): boolean {
    return this.gameState === GameState.STARTED;
  }

  gameOver() {
    this.gameState = GameState.OVER;
  }

  killGame() {}

  abstract startGame(): void;
}
