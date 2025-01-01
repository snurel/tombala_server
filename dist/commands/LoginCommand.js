"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginCommand = void 0;
const BaseCommand_1 = require("./BaseCommand");
const Messages_1 = require("../enums/Messages");
const Logger_1 = __importDefault(require("../Utility/Logger"));
class LoginCommand extends BaseCommand_1.BaseCommand {
    handle(socket, user, message) {
        Logger_1.default.info(`Name received: ${message} -> from: ${socket.id}`);
        if (!user || !message) {
            return;
        }
        user.initPlayer(message.name);
        const game = this.gameManager.getGame(message.code);
        if (!game) {
            socket.emit(Messages_1.Messages.GameNotFound, `Oyun bulunumadı kodu (${message.code} kontrol etmelisiniz!)`);
            return;
        }
        game.addPlayer(user);
        const managerUser = this.userManager.users.get(game.getManager());
        managerUser === null || managerUser === void 0 ? void 0 : managerUser.socket.emit(Messages_1.Messages.NewPlayerJoined, {
            name: user.getName(),
        });
        const roomId = this.ioManager.getRoomId(game.getId());
        socket.join(roomId);
    }
}
exports.LoginCommand = LoginCommand;
