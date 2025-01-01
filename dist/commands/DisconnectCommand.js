"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisconnectCommand = void 0;
const BaseCommand_1 = require("./BaseCommand");
const Messages_1 = require("../enums/Messages");
class DisconnectCommand extends BaseCommand_1.BaseCommand {
    handle(socket, user) {
        console.log(`User disconnected: ${socket.id}`);
        const id = socket.id.toString();
        this.userManager.users.delete(id);
        const managedGameId = this.gameManager.managers.get(socket.id);
        if (!managedGameId) {
            return;
        }
        const managedGame = this.gameManager.getGame(managedGameId);
        if (managedGame) {
            managedGame.killGame();
            this.ioManager.broadcastToGame(managedGame.getId(), Messages_1.Messages.ManagerDisconnected);
        }
        this.gameManager.clearGame(managedGameId, socket.id);
    }
}
exports.DisconnectCommand = DisconnectCommand;
