import { Messages } from '../../shared/abstractClasses/Messages';

export class TombalaMessages extends Messages {
  static readonly NameInitialized = 'name_initialized';
  static readonly Manager = 'manager';
  static readonly ManagerDisconnected = 'manager_disconnected';
  static readonly JoinedToGame = 'joined_to_game';
  static readonly TakeNumber = 'take_number';
}
