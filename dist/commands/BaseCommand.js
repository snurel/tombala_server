"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const GameManager_1 = require("../managers/GameManager");
const UserManager_1 = require("../managers/UserManager");
const IOManager_1 = require("../managers/IOManager");
class BaseCommand {
    constructor() {
        this.gameManager = GameManager_1.GameManager.instance;
        this.userManager = UserManager_1.UserManager.instance;
        this.ioManager = IOManager_1.IOManager.instance;
    }
}
exports.BaseCommand = BaseCommand;
