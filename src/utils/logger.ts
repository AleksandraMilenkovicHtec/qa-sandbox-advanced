import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:yyyy-mm-dd HH:MM:ss', ignore: 'pid,hostname' },
  },
});

const sanitize = (message: string) => message.replace(/\r\n|\r|\n/g, ' ');

export const logStep = (message: string) => logger.info(sanitize(message));
