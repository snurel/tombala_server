"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const Messages_1 = require("../enums/Messages");
const LoginCommand_1 = require("../commands/LoginCommand");
const DisconnectCommand_1 = require("../commands/DisconnectCommand");
const ManagerCommand_1 = require("../commands/ManagerCommand");
const Logger_1 = __importDefault(require("../Utility/Logger"));
class UserManager {
    static init() {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        this.instance.initCommands();
    }
    constructor() {
        this.handleMessage = (event, socket, isOnce) => {
            const listener = (message) => {
                const user = this.users.get(socket.id);
                const handler = this.commands.get(event);
                if (handler) {
                    handler.handle(socket, user, message);
                }
                else {
                    Logger_1.default.warn(`Handler for event '${event}' not found.`);
                }
            };
            if (isOnce) {
                socket.once(event, listener);
            }
            else {
                socket.on(event, listener);
            }
        };
        this.users = new Map();
        this.connectionUserMap = new Map();
        this.commands = new Map();
    }
    initCommands() {
        this.commands.set(Messages_1.Messages.Manager, new ManagerCommand_1.ManagerCommand());
        this.commands.set(Messages_1.Messages.Login, new LoginCommand_1.LoginCommand());
        this.commands.set(Messages_1.Messages.Disconnect, new DisconnectCommand_1.DisconnectCommand());
    }
    addListeners(socket) {
        Logger_1.default.info(`New Connection: ${socket.id}`);
        this.handleMessage(Messages_1.Messages.Manager, socket, true);
        this.handleMessage(Messages_1.Messages.Login, socket, true);
        this.handleMessage(Messages_1.Messages.Disconnect, socket);
    }
    addUser(user) {
        const exist = this.users.has(user.id);
        if (!exist) {
            this.users.set(user.id, user);
        }
        this.addListeners(user.socket);
    }
    updateSocket(socket, name) {
        // const id = socket.id.toString();
        // const user = this.users.find((u) => u.getName() === name);
        // if (user) {
        //   user.socket = socket;
        // }
    }
}
exports.UserManager = UserManager;
