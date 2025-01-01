import { Socket } from 'socket.io';
import { Connection } from '../components/Connection';
import { ConnectionManager } from '../managers/ConnectionManager';
import { GameManager } from '../managers/GameManager';
import { IOManager } from '../managers/IOManager';

export abstract class BaseCommand<
  TGameManager extends GameManager,
  TConnectionManager extends ConnectionManager
> {
  protected gameManager: TGameManager;
  protected connectionManager: TConnectionManager;
  protected ioManager: IOManager;
  constructor() {
    this.gameManager = GameManager.getInstance();
    this.connectionManager = ConnectionManager.getInstance();
    this.ioManager = IOManager.instance;
  }
  abstract handle(socket: Socket, conn?: Connection, message?: any): any;
}
