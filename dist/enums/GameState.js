"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState[GameState["NOT_STARTED"] = 0] = "NOT_STARTED";
    GameState[GameState["STARTED"] = 1] = "STARTED";
    GameState[GameState["OVER"] = 2] = "OVER";
})(GameState || (exports.GameState = GameState = {}));
