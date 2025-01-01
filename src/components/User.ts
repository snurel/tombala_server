import { Socket } from 'socket.io';
import { ClientType } from '../enums/ClientType';
import { SlotType } from '../enums/SlotType';

export class User {
  socket: Socket;
  id: string;
  type: ClientType;
  managementGameId?: number;
  slots: SlotType[];
  gameId?: number;
  color?: string;

  private name: string | undefined;
  constructor(socket: Socket) {
    this.socket = socket;
    this.type = ClientType.LOBBY;
    this.id = socket.id.toString();
    this.slots = [];
  }

  initPlayer(gameId: number) {
    this.type = ClientType.PLAYER;
    this.gameId = gameId;
  }

  initManager(gameId: number) {
    this.type = ClientType.MANAGER;
    this.managementGameId = gameId;
  }

  setName(name: string) {
    this.name = name;
  }

  getName(): string | undefined {
    return this.name;
  }

  isInitialized(): boolean {
    return this.type !== ClientType.LOBBY;
  }

  allFounded(): boolean {
    const empty = this.slots.some((s) => !s.found);
    return !empty;
  }

  setSlots(slots: SlotType[]) {
    this.slots = slots;
  }

  setColor(color: string) {
    this.color = color;
  }

  checkNum(num: number) {
    const slot = this.slots.find((s) => s.value === num);
    if (slot) {
      slot.found = true;
    }
  }

  resetSlots() {
    this.slots.forEach((sl) => {
      sl.found = false;
    });
  }
}
