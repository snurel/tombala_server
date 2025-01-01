"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserManager_1 = require("./managers/UserManager");
const GameManager_1 = require("./managers/GameManager");
const IOManager_1 = require("./managers/IOManager");
IOManager_1.IOManager.init();
GameManager_1.GameManager.init();
UserManager_1.UserManager.init();
