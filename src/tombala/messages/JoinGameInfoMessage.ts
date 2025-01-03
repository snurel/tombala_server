import { SlotType } from '../enums/SlotType';

export type JoinGameInfoMessage = {
  playId: number;
  gameId: number;
  color: string;
  slots: SlotType[];
};
