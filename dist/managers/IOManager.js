"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOManager = void 0;
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const UserManager_1 = require("./UserManager");
const User_1 = require("../components/User");
const Logger_1 = __importDefault(require("../Utility/Logger"));
class IOManager {
    static init() {
        if (!this.instance) {
            this.instance = new IOManager();
        }
    }
    constructor() {
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: '*',
            },
        });
        this.io.on('connection', (socket) => {
            const user = new User_1.User(socket);
            UserManager_1.UserManager.instance.addUser(user);
        });
        const PORT = 5200;
        server.listen(PORT, () => {
            Logger_1.default.info(`Server is ready: http://localhost:${PORT}`);
        });
    }
    getRoomId(gameId) {
        return `#${gameId}`;
    }
    broadcastToGame(gameId, command, message) {
        this.broadcastToRoom(this.getRoomId(gameId), command, message);
    }
    broadcastToRoom(roomId, command, message) {
        this.io.to(roomId).emit(command, message);
    }
}
exports.IOManager = IOManager;
