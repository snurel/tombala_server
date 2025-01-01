import { Socket } from 'socket.io';
import { ClientType } from '../enums/ClientType';
import { SlotType } from '../enums/SlotType';
import { Player } from './Player';
import { GameAdmin } from './GameAdmin';

export class Connection {
  socket: Socket;
  id: string;
  type: ClientType;
  player?: Player;
  admin?: GameAdmin;

  private name: string | undefined;

  constructor(socket: Socket) {
    this.socket = socket;
    this.type = ClientType.LOBBY;
    this.id = socket.id.toString();
  }

  initPlayer(player: Player) {
    this.type = ClientType.PLAYER;
    this.player = player;
  }

  initAdmin(admin: GameAdmin) {
    this.type = ClientType.MANAGER;
    this.admin = admin;
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
}
