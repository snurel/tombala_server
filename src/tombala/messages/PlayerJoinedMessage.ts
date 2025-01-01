import { JoinGameInfoMessage } from './JoinGameInfoMessage';

export type PlayerJoinedMessage = {
  name: string;
  id: number;
  info: JoinGameInfoMessage;
};
