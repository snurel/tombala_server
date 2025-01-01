import { IConnectionDetails } from '../../shared/components/IConnectionDetails';
import { Player } from '../../shared/components/Player';
import { GameAdmin } from '../components/GameAdmin';
import { TombalaPlayer } from '../components/TombalaPlayer';
import { ClientType } from '../enums/ClientType';

export class TombalaConnectionDetails implements IConnectionDetails {
  type: ClientType;
  player?: TombalaPlayer;
  admin?: GameAdmin;

  constructor() {
    this.type = ClientType.LOBBY;
  }

  initAdmin(admin: GameAdmin) {
    this.type = ClientType.MANAGER;
    this.admin = admin;
  }

  initPlayer(player: TombalaPlayer) {
    this.type = ClientType.PLAYER;
    this.player = player;
  }

  isInitialized(): boolean {
    return this.type !== ClientType.LOBBY;
  }
}
