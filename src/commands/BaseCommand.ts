import { Socket } from 'socket.io';
import { Connection } from '../components/Connection';
import { GameManager } from '../managers/GameManager';
import { ConnectionManager } from '../managers/ConnectionManager';
import { IOManager } from '../managers/IOManager';

export abstract class BaseCommand {
  protected gameManager: GameManager;
  protected connectionManager: ConnectionManager;
  protected ioManager: IOManager;
  constructor() {
    this.gameManager = GameManager.instance;
    this.connectionManager = ConnectionManager.instance;
    this.ioManager = IOManager.instance;
  }
  abstract handle(socket: Socket, conn?: Connection, message?: any): any;
}
