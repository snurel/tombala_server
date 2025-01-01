import { Socket } from 'socket.io';
import { User } from './User';
import { IConnectionDetails } from './IConnectionDetails';

export class Connection {
  private socket: Socket;
  private id: string;

  private user: User | undefined;

  private details?: IConnectionDetails;

  constructor(socket: Socket) {
    this.socket = socket;
    this.id = socket.id.toString();
  }

  setDetails<T extends IConnectionDetails>(details: T): void {
    this.details = details;
  }

  getDetails<T extends IConnectionDetails>(): T {
    return this.details as T;
  }

  getId(): string {
    return this.id;
  }

  getSocket(): Socket {
    return this.socket;
  }

  updateSocket(s: Socket) {
    this.socket = s;
    this.id = s.id.toString();
  }

  setUser(user: User) {
    this.user = user;
  }

  getUserName(): string | undefined {
    return this.user?.getName();
  }

  getUserCode(): string | undefined {
    return `${this.user?.getName()}-${this.user?.getSecret()}`;
  }
}
