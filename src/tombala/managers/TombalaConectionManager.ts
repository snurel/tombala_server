import { LoginCommand } from '../../tombala/commands/LoginCommand';
import { DisconnectCommand } from '../../tombala/commands/DisconnectCommand';
import { ManagerCommand } from '../../tombala/commands/ManagerCommand';
import { JoinGameCommand } from '../../tombala/commands/JoinGameCommand';
import { StartGameCommand } from '../../tombala/commands/StartGameCommand';
import { TakeNumberCommand } from '../../tombala/commands/TakeNumberCommand';
import { ConnectionManager } from '../../shared/managers/ConnectionManager';
import { TombalaMessages } from '../enums/Messages';

export class TombalaConnectionManager extends ConnectionManager {
  initCommands() {
    this.initCommand(TombalaMessages.Manager, new ManagerCommand());
    this.initCommand(TombalaMessages.Login, new LoginCommand());
    this.initCommand(TombalaMessages.JoinGame, new JoinGameCommand());
    this.initCommand(TombalaMessages.Disconnect, new DisconnectCommand());
    this.initCommand(TombalaMessages.Start, new StartGameCommand());
    this.initCommand(TombalaMessages.TakeNumber, new TakeNumberCommand());
  }
}
