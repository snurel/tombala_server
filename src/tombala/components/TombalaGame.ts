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
  private players: TombalaPlayer[];
  private static MAX_NUM = 29;

  constructor(gameId: number) {
    super(gameId);
    this.colors = new ColorPalette();
    this.players = [];
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

    this.players.forEach((player) => {
      player.checkNum(lucky);
    });

    return lucky;
  }

  getPlayers(): TombalaPlayer[] {
    return this.players;
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

    this.players.push(player);

    return player;
  }

  checkResult(): TombalaPlayer[] {
    const winners = this.players.filter((p) => p.allFounded());
    const ended = this.remainings.length === 0;
    if (ended) {
      this.gameOver();
    }

    return winners;
  }

  gameOver(): void {
    super.gameOver();
  }

  removePlayer(playerId: number) {
    const index = this.players.findIndex((p) => p.getId() === playerId);
    if (index > -1) {
      this.players.splice(index, 1);
    }
  }

  removePlayers(playerIds: number[]) {
    this.players = this.players.filter(
      (p) => playerIds.indexOf(p.getId()) === -1
    );
  }

  resetNumbers() {
    this.founds = [];
    this.remainings = this.generateRandomNumbers();
  }

  resetPlayers() {
    this.players.forEach((player) => {
      player.resetSlots();
    });
  }

  startGame() {
    this.gameState = GameState.STARTED;
    this.resetPlayers();
    this.resetNumbers();
  }

  killGame(): void {
    // throw new Error('Method not implemented.');
  }
}
