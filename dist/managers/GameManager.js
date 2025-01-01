"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("../components/Game");
class GameManager {
    static init() {
        if (!this.instance) {
            this.instance = new GameManager();
        }
    }
    constructor() {
        this.games = new Map();
        this.usedCodes = new Set();
        this.managers = new Map();
    }
    getGame(id) {
        return this.games.get(id);
    }
    createGame(managerId) {
        const id = this.generateUniqueCode();
        const game = new Game_1.Game(id, managerId);
        this.games.set(id, game);
        this.managers.set(managerId, id);
        return id;
    }
    clearGame(gameId, managerId) {
        this.games.delete(gameId);
        if (managerId) {
            this.managers.delete(managerId);
        }
    }
    generateUniqueCode() {
        let code;
        do {
            code = Math.floor(1000 + Math.random() * 9000);
        } while (this.usedCodes.has(code));
        this.usedCodes.add(code);
        return code;
    }
}
exports.GameManager = GameManager;
