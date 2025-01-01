import { SlotType } from '../enums/SlotType';

export class Player {
  private gameId: number;
  private slots: SlotType[];
  private cardColor: string;
  private id: number;
  private name: string;

  private connectionId?: string;

  constructor(
    id: number,
    name: string,
    gameId: number,
    slots: SlotType[],
    color: string
  ) {
    this.id = id;
    this.name = name;
    this.gameId = gameId;
    this.slots = slots;
    this.cardColor = color;
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

  getSlots(): SlotType[] {
    return this.slots;
  }

  getColor(): string {
    return this.cardColor;
  }

  resetSlots() {
    this.slots.forEach((sl) => {
      sl.found = false;
    });
  }

  checkNum(num: number) {
    const slot = this.slots.find((s) => s.value === num);
    if (slot) {
      slot.found = true;
    }
  }

  allFounded(): boolean {
    const empty = this.slots.some((s) => !s.found);
    return !empty;
  }
}
