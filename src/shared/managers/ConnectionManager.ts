import { Socket } from 'socket.io';
import { Connection } from '../components/Connection';
import Logger from '../utility/Logger';
import { BaseCommand } from '../abstractClasses/BaseCommand';
import { Messages } from '../abstractClasses/Messages';

export abstract class ConnectionManager {
  connections: Map<string, Connection>;

  private static instance: ConnectionManager;
  protected commands: Map<Messages, BaseCommand<any, any>>;

  static init(manager: ConnectionManager) {
    if (!this.instance) {
      this.instance = manager;
    }

    this.instance.initCommands();
  }

  static getInstance<T extends ConnectionManager>() {
    return this.instance as T;
  }

  constructor() {
    this.connections = new Map();
    this.commands = new Map();
  }

  abstract initCommands(): void;
  protected initCommand(msg: Messages, cmd: BaseCommand<any, any>) {
    this.commands.set(msg, cmd);
  }

  private addListeners(socket: Socket): void {
    [...this.commands.values()].forEach((cmd) => {
      this.handleMessage(cmd, socket);
    });
  }

  handleMessage = (event: Messages, socket: Socket, isOnce?: boolean) => {
    const listener = (message: any) => {
      const conn = this.connections.get(socket.id);

      const handler = this.commands.get(event);
      if (handler) {
        handler.handle(socket, conn, message);
      } else {
        Logger.warn(`Handler for event '${event}' not found.`);
      }
    };

    if (isOnce) {
      socket.once(event as string, listener);
    } else {
      socket.on(event as string, listener);
    }
  };

  addConnection(conn: Connection) {
    const exist = this.connections.has(conn.getId());
    if (!exist) {
      this.connections.set(conn.getId(), conn);
    }

    this.addListeners(conn.getSocket());
  }

  updateSocket(name: string, socket: Socket): Connection | null {
    const conn = this.findConnectionByCode(name);

    if (conn) {
      if (conn.getSocket().id !== socket.id) {
        conn.getSocket().disconnect();
      }

      conn.updateSocket(socket);

      return conn;
    }

    return null;
  }

  private findConnectionByCode(code: string): Connection | undefined {
    for (const conn of this.connections.values()) {
      if (conn.getUserCode() === code) {
        return conn;
      }
    }
    return undefined;
  }
}
