type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private static levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private static logLevel: LogLevel =
    (process.env.LOG_LEVEL as LogLevel) || 'info';

  private static shouldLog(level: LogLevel): boolean {
    return Logger.levels[level] <= Logger.levels[Logger.logLevel];
  }

  private static formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }

  static log(level: LogLevel, message: string): void {
    if (Logger.shouldLog(level)) {
      console.log(Logger.formatMessage(level, message));
    }
  }

  static info(message: string): void {
    Logger.log('info', message);
  }

  static warn(message: string): void {
    Logger.log('warn', message);
  }

  static error(message: string): void {
    Logger.log('error', message);
  }

  static debug(message: string): void {
    Logger.log('debug', message);
  }
}

export default Logger;
