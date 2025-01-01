import { GameState } from '../enums/GameState';
import { SlotType } from '../enums/SlotType';
import { JoinGameInfoMessage } from '../messages/JoinGameInfoMessage';
import { ColorPalette } from './ColorPalette';
import { User } from './User';

export class Game {
  private id: number;
  private managerId: string;
  private players: Map<string, User>;
  private founds: number[] = [];
  private remainings: number[] = [];
  private gameState: GameState;
  private colors: ColorPalette;
  private static MAX_NUM = 99;

  constructor(id: number, managerId: string) {
    this.id = id;
    this.managerId = managerId;
    this.gameState = GameState.NOT_STARTED;
    this.players = new Map();
    this.colors = new ColorPalette();
  }

  startGame() {
    this.gameState = GameState.STARTED;
    this.resetPlayers();
    this.resetNumbers();
  }

  getId(): number {
    return this.id;
  }

  getNumber(): number {
    const lucky = this.remainings.shift();
    if (!lucky) {
      return -1;
    }

    this.founds.push(lucky);

    this.getPlayers().forEach((player) => {
      player.checkNum(lucky);
    });

    return lucky;
  }

  resetNumbers() {
    this.founds = [];
    this.remainings = this.generateRandomNumbers();
  }

  resetPlayers() {
    this.getPlayers().forEach((player) => {
      player.resetSlots();
    });
  }

  checkResult(): User[] {
    const winners = this.getPlayers().filter((p) => p.allFounded());
    const ended = this.remainings.length === 0;
    if (ended) {
      this.gameOver();
    }

    return winners;
  }

  addPlayer(player: User): JoinGameInfoMessage {
    this.players.set(player.id, player);

    const slots = this.selectSlots();
    const color = this.colors.getColor();
    player.setSlots(slots);
    player.setColor(color);

    return {
      gameId: this.id,
      color,
      slots,
    };
  }

  isStarted(): boolean {
    return this.gameState === GameState.STARTED;
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);
  }

  gameOver() {
    this.gameState = GameState.OVER;
  }

  killGame() {}

  getManager(): string {
    return this.managerId;
  }

  private getPlayers(): User[] {
    return [...this.players.values()];
  }

  private generateRandomNumbers(): number[] {
    const numbers = [];
    for (let i = 1; i <= Game.MAX_NUM; i++) {
      numbers.push(i);
    }

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers;
  }

  private generatePlayerNumbers(): number[] {
    const numbers = new Set();

    while (numbers.size < 15) {
      const randomNum = Math.floor(Math.random() * Game.MAX_NUM) + 1;
      numbers.add(randomNum);
    }

    const nums = Array.from(numbers).sort(
      (a, b) => (a as number) - (b as number)
    );
    return nums as number[];
  }

  private selectSlots(): SlotType[] {
    const numbers = this.generatePlayerNumbers();
    return numbers.map((num) => ({ value: num }));
  }
}