"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerCommand = void 0;
const BaseCommand_1 = require("./BaseCommand");
const Messages_1 = require("../enums/Messages");
class ManagerCommand extends BaseCommand_1.BaseCommand {
    handle(socket, user, message) {
        const gameId = this.gameManager.createGame(user.id);
        user === null || user === void 0 ? void 0 : user.initManager(gameId);
        socket.emit(Messages_1.Messages.Manager, { gameId });
        const roomId = this.ioManager.getRoomId(gameId);
        socket.join(roomId);
    }
}
exports.ManagerCommand = ManagerCommand;
