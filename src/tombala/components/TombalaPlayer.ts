import { SlotType } from '../enums/SlotType';
import { Player } from '../../shared/components/Player';

export class TombalaPlayer extends Player {
  private slots: SlotType[];
  private cardColor: string;

  constructor(
    id: number,
    name: string,
    gameId: number,
    slots: SlotType[],
    color: string
  ) {
    super(id, name, gameId);
    this.slots = slots;
    this.cardColor = color;
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
