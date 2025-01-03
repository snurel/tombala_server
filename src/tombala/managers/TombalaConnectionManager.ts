import { LoginCommand } from '../commands/LoginCommand';
import { DisconnectCommand } from '../commands/DisconnectCommand';
import { ManagerCommand } from '../commands/ManagerCommand';
import { JoinGameCommand } from '../commands/JoinGameCommand';
import { StartGameCommand } from '../commands/StartGameCommand';
import { TakeNumberCommand } from '../commands/TakeNumberCommand';
import { ConnectionManager } from '../../shared/managers/ConnectionManager';
import { TombalaMessages } from '../enums/Messages';
import { QuitGameCommand } from '../commands/QuitGameCommand';

export class TombalaConnectionManager extends ConnectionManager {
  initCommands() {
    this.initCommand(TombalaMessages.Manager, new ManagerCommand());
    this.initCommand(TombalaMessages.Login, new LoginCommand());
    this.initCommand(TombalaMessages.JoinGame, new JoinGameCommand());
    this.initCommand(TombalaMessages.Disconnect, new DisconnectCommand());
    this.initCommand(TombalaMessages.Start, new StartGameCommand());
    this.initCommand(TombalaMessages.TakeNumber, new TakeNumberCommand());
    this.initCommand(TombalaMessages.QuitGame, new QuitGameCommand());
  }
}
