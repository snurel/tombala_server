import { Socket } from 'socket.io';
import { User } from '../components/User';
import { GameManager } from '../managers/GameManager';
import { UserManager } from '../managers/UserManager';
import { IOManager } from '../managers/IOManager';

export abstract class BaseCommand {
  protected gameManager: GameManager;
  protected userManager: UserManager;
  protected ioManager: IOManager;
  constructor() {
    this.gameManager = GameManager.instance;
    this.userManager = UserManager.instance;
    this.ioManager = IOManager.instance;
  }
  abstract handle(socket: Socket, user?: User, message?: any): any;
}
