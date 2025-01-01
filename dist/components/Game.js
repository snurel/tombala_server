"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const GameState_1 = require("../enums/GameState");
class Game {
    constructor(id, managerId) {
        this.id = id;
        this.managerId = managerId;
        this.gameState = GameState_1.GameState.NOT_STARTED;
        this.players = [];
        this.founds = [];
        this.remainings = this.generateRandomNumbers();
    }
    startGame() {
        this.gameState = GameState_1.GameState.STARTED;
    }
    getId() {
        return this.id;
    }
    getNumber() {
        const lucky = this.remainings.shift();
        if (lucky) {
            this.founds.push(lucky);
        }
        return lucky !== null && lucky !== void 0 ? lucky : -1;
    }
    checkResult() {
        const winners = this.players.filter((p) => p.allFounded());
        const ended = this.remainings.length === 0;
        if (ended) {
            this.gameOver();
        }
    }
    addPlayer(player) {
        this.players.push(player);
    }
    gameOver() { }
    killGame() { }
    getManager() {
        return this.managerId;
    }
    generateRandomNumbers() {
        const numbers = [];
        for (let i = 1; i <= 99; i++) {
            numbers.push(i);
        }
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        return numbers;
    }
}
exports.Game = Game;
