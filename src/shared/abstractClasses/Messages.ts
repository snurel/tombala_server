export abstract class Messages {
  static readonly Disconnect = 'disconnect';
  static readonly Reconnect = 'reconnect';
  static readonly Login = 'login';
  static readonly JoinGame = 'join_game';
  static readonly QuitGame = 'quit_game';
  static readonly Start = 'start_game';
  static readonly GameNotFound = 'game_not_found';
  static readonly NewPlayerJoined = 'new_player_joined';
  static readonly PlayerLeft = 'player_left';
  static readonly AlreadyStarted = 'already_started';
  static readonly PlayerNotFound = 'player_not_found';
  static readonly GameOver = 'game_over';
}
