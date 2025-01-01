import { GameManager } from '../../shared/managers/GameManager';
import { GameState } from '../enums/GameState';
import { SlotType } from '../enums/SlotType';
import { ColorPalette } from './ColorPalette';
import { Game } from '../../shared/components/Game';
import { TombalaPlayer } from './TombalaPlayer';
import { GameAdmin } from './GameAdmin';

export class TombalaGame extends Game {
  private colors: ColorPalette;
  private founds: number[] = [];
  private remainings: number[] = [];
  private manager!: GameAdmin;
  private players: Map<number, TombalaPlayer>;
  private static MAX_NUM = 99;

  constructor(gameId: number) {
    super(gameId);
    this.colors = new ColorPalette();
    this.players = new Map();
  }

  setManager(admin: GameAdmin) {
    this.manager = admin;
  }

  getManager(): GameAdmin {
    return this.manager!;
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

  private getPlayers(): TombalaPlayer[] {
    return [...this.players.values()];
  }

  private generateRandomNumbers(): number[] {
    const numbers = [];
    for (let i = 1; i <= TombalaGame.MAX_NUM; i++) {
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
      const randomNum = Math.floor(Math.random() * TombalaGame.MAX_NUM) + 1;
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

  addPlayer(name: string): TombalaPlayer {
    const slots = this.selectSlots();
    const color = this.colors.getColor();

    const player = new TombalaPlayer(
      GameManager.generateId(),
      name,
      this.id,
      slots,
      color
    );

    this.players.set(player.getId(), player);

    return player;
  }

  checkResult(): TombalaPlayer[] {
    const winners = this.getPlayers().filter((p) => p.allFounded());
    const ended = this.remainings.length === 0;
    if (ended) {
      this.gameOver();
    }

    return winners;
  }

  removePlayer(playerId: number) {
    this.players.delete(playerId);
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

  startGame() {
    this.gameState = GameState.STARTED;
    this.resetPlayers();
    this.resetNumbers();
  }
}
