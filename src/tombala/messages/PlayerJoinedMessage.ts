import { JoinGameInfoMessage } from './JoinGameInfoMessage';

export type PlayerJoinedMessage = {
  name: string;
  id: string;
  info: JoinGameInfoMessage;
};
