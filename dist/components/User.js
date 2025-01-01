"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const ClientType_1 = require("../enums/ClientType");
class User {
    constructor(socket) {
        this.socket = socket;
        this.type = ClientType_1.ClientType.LOBBY;
        this.id = socket.id.toString();
        this.slots = [];
    }
    initPlayer(name) {
        this.type = ClientType_1.ClientType.PLAYER;
        this.name = name;
    }
    initManager(gameId) {
        this.type = ClientType_1.ClientType.MANAGER;
        this.managementGameId = gameId;
    }
    getName() {
        return this.name;
    }
    isInitialized() {
        return this.type !== ClientType_1.ClientType.LOBBY;
    }
    allFounded() {
        const empty = this.slots.some((s) => !s.found);
        return !empty;
    }
}
exports.User = User;
