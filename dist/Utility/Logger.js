"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    static shouldLog(level) {
        return Logger.levels[level] <= Logger.levels[Logger.logLevel];
    }
    static formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }
    static log(level, message) {
        if (Logger.shouldLog(level)) {
            console.log(Logger.formatMessage(level, message));
        }
    }
    static info(message) {
        Logger.log('info', message);
    }
    static warn(message) {
        Logger.log('warn', message);
    }
    static error(message) {
        Logger.log('error', message);
    }
    static debug(message) {
        Logger.log('debug', message);
    }
}
Logger.levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};
Logger.logLevel = process.env.LOG_LEVEL || 'info';
exports.default = Logger;
