import { SlotType } from '../enums/SlotType';

export type JoinGameInfoMessage = {
  gameId: number;
  color: string;
  slots: SlotType[];
};
