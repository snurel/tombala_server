import { Socket } from 'socket.io';
import { Connection } from '../../shared/components/Connection';
import { TombalaMessages } from '../enums/Messages';
import { TombalaConnectionManager } from '../managers/TombalaConnectionManager';
import { BaseCommand } from '../../shared/abstractClasses/BaseCommand';
import { TombalaGameManager } from '../managers/TombalaGameManager';
import { TombalaConnectionDetails } from './TombalaConnectionDetails';

export class ManagerCommand extends BaseCommand<
  TombalaGameManager,
  TombalaConnectionManager
> {
  handle(socket: Socket, conn?: Connection, message?: any) {
    const game = this.gameManager.create();
    const admin = game.getManager();

    const details = new TombalaConnectionDetails();
    details.initAdmin(admin);
    conn?.setDetails(details);

    this.gameManager.storeManagerSocket(admin.getId(), socket.id);

    socket.emit(TombalaMessages.Manager, { gameId: game.getId() });

    const roomId = this.ioManager.getRoomId(game.getId());
    socket.join(roomId);
  }
}
