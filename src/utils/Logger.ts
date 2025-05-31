// Logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    private color(level: LogLevel): string {
        switch (level) {
            case 'debug': return '\x1b[36m'; // cyan
            case 'info':  return '\x1b[32m'; // green
            case 'warn':  return '\x1b[33m'; // yellow
            case 'error': return '\x1b[31m'; // red
            default:      return '\x1b[0m';  // reset
        }
    }

    private format(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        const color = this.color(level);
        const reset = '\x1b[0m';
        return `${color}[${timestamp}] [${this.context}] [${level.toUpperCase()}]: ${message}${reset}`;
    }

    debug(message: string) {
        if (__DEV__) {
            console.debug(this.format('debug', message));
        }
    }

    info(message: string) {
        if (__DEV__) {
            console.info(this.format('info', message));
        }
    }

    warn(message: string) {
        console.warn(this.format('warn', message));
    }

    error(message: string) {
        console.error(this.format('error', message));
    }
}
