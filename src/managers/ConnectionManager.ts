import { Socket } from 'socket.io';
import { Connection } from '../components/Connection';
import { Messages } from '../enums/Messages';
import { BaseCommand } from '../commands/BaseCommand';
import { LoginCommand } from '../commands/LoginCommand';
import { DisconnectCommand } from '../commands/DisconnectCommand';
import { ManagerCommand } from '../commands/ManagerCommand';
import Logger from '../Utility/Logger';
import { JoinGameCommand } from '../commands/JoinGameCommand';
import { StartGameCommand } from '../commands/StartGameCommand';
import { TakeNumberCommand } from '../commands/TakeNumberCommand';

export class ConnectionManager {
  connections: Map<string, Connection>;
  private connectionPlayerMap: Map<number, Socket[]>;

  static instance: ConnectionManager;
  private commands: Map<Messages, BaseCommand>;

  static init() {
    if (!this.instance) {
      this.instance = new ConnectionManager();
    }

    this.instance.initCommands();
  }

  constructor() {
    this.connections = new Map();
    this.connectionPlayerMap = new Map();
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
      const user = this.connections.get(socket.id);

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

  addConnection(conn: Connection) {
    const exist = this.connections.has(conn.id);
    if (!exist) {
      this.connections.set(conn.id, conn);
    }

    this.addListeners(conn.socket);
  }

  updateSocket(name: string, socket: Socket): Connection | null {
    const conn = this.findConnectionByName(name);

    if (conn) {
      if (conn.socket.id !== socket.id) {
        conn.socket.disconnect();
      }

      conn.socket = socket;

      return conn;
    }

    return null;
  }

  private findConnectionByName(name: string): Connection | undefined {
    for (const conn of this.connections.values()) {
      if (conn.getName() === name) {
        return conn;
      }
    }
    return undefined;
  }
}
