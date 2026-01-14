/**
 * Environment-aware logger utility
 * Logs in development, silent in production (or sends to monitoring service)
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

class Logger {
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  private formatMessage(message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefixStr = this.prefix ? `[${this.prefix}]` : '';
    return `${timestamp} ${prefixStr} ${message}`;
  }

  log(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.log(this.formatMessage(message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.warn(this.formatMessage(message), ...args);
    } else {
      // In production, you might want to send to a monitoring service
      // e.g., Sentry, LogRocket, etc.
    }
  }

  error(message: string, error?: any, ...args: any[]): void {
    if (isDevelopment) {
      console.error(this.formatMessage(message), error, ...args);
    } else {
      // In production, send to error monitoring service
      // e.g., Sentry.captureException(error);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (isDevelopment) {
      console.debug(this.formatMessage(message), ...args);
    }
  }
}

// Export a default logger instance
export const logger = new Logger();

// Export factory function for creating named loggers
export const createLogger = (prefix: string): Logger => {
  return new Logger(prefix);
};

// Browser-specific logger (for client components)
export class BrowserLogger {
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  private get isDev(): boolean {
    return typeof window !== 'undefined' &&
           (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1');
  }

  private formatMessage(message: string): string {
    const timestamp = new Date().toISOString();
    const prefixStr = this.prefix ? `[${this.prefix}]` : '';
    return `${timestamp} ${prefixStr} ${message}`;
  }

  log(message: string, ...args: any[]): void {
    if (this.isDev) {
      console.log(this.formatMessage(message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.isDev) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.isDev) {
      console.warn(this.formatMessage(message), ...args);
    }
  }

  error(message: string, error?: any, ...args: any[]): void {
    if (this.isDev) {
      console.error(this.formatMessage(message), error, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.isDev) {
      console.debug(this.formatMessage(message), ...args);
    }
  }
}

export const browserLogger = new BrowserLogger();
export const createBrowserLogger = (prefix: string): BrowserLogger => {
  return new BrowserLogger(prefix);
};
