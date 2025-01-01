import { Socket } from 'socket.io';
import { User } from '../components/User';
import { Messages } from '../enums/Messages';
import { BaseCommand } from '../commands/BaseCommand';
import { LoginCommand } from '../commands/LoginCommand';
import { DisconnectCommand } from '../commands/DisconnectCommand';
import { ManagerCommand } from '../commands/ManagerCommand';
import Logger from '../Utility/Logger';
import { JoinGameCommand } from '../commands/JoinGameCommand';
import { StartGameCommand } from '../commands/StartGameCommand';
import { TakeNumberCommand } from '../commands/TakeNumberCommand';

export class UserManager {
  users: Map<string, User>;
  private connectionUserMap: Map<string, Socket[]>;

  static instance: UserManager;
  private commands: Map<Messages, BaseCommand>;

  static init() {
    if (!this.instance) {
      this.instance = new UserManager();
    }

    this.instance.initCommands();
  }

  constructor() {
    this.users = new Map();
    this.connectionUserMap = new Map();
    this.commands = new Map();
  }

  initCommands() {
    this.commands.set(Messages.Manager, new ManagerCommand());
    this.commands.set(Messages.Login, new LoginCommand());
    this.commands.set(Messages.JoinGame, new JoinGameCommand());
    this.commands.set(Messages.Disconnect, new DisconnectCommand());
    this.commands.set(Messages.Start, new StartGameCommand());
    this.commands.set(Messages.TakeNumber, new TakeNumberCommand());
  }

  addListeners(socket: Socket) {
    Logger.info(`New Connection: ${socket.id}`);

    this.handleMessage(Messages.Manager, socket);
    this.handleMessage(Messages.Login, socket, true);
    this.handleMessage(Messages.JoinGame, socket);
    this.handleMessage(Messages.Disconnect, socket);
    this.handleMessage(Messages.Start, socket);
    this.handleMessage(Messages.TakeNumber, socket);
  }

  handleMessage = (event: Messages, socket: any, isOnce?: boolean) => {
    const listener = (message: any) => {
      const user = this.users.get(socket.id);

      const handler = this.commands.get(event);
      if (handler) {
        handler.handle(socket, user, message);
      } else {
        Logger.warn(`Handler for event '${event}' not found.`);
      }
    };

    if (isOnce) {
      socket.once(event, listener);
    } else {
      socket.on(event, listener);
    }
  };

  addUser(user: User) {
    const exist = this.users.has(user.id);
    if (!exist) {
      this.users.set(user.id, user);
    }

    this.addListeners(user.socket);
  }

  updateSocket(name: string, socket: Socket): User | null {
    const user = this.findUserByName(name);

    if (user) {
      if (user.socket.id !== socket.id) {
        user.socket.disconnect();
      }

      user.socket = socket;

      return user;
    }

    return null;
  }

  private findUserByName(name: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.getName() === name) {
        return user;
      }
    }
    return undefined;
  }
}
