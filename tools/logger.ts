import winston from "winston";

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log' }),
    ],
    format: winston.format.printf((log: any) => `[${log.level.toUpperCase()}] - ${log.message}`),
});

export default logger;