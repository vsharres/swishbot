import Discord from 'discord.js';
import mongoose from 'mongoose';
import { Configs } from './config/configs';
import winston from 'winston';
import { Zaps } from './handlers/zaps';
import { Points } from './handlers/points';
import { Handler } from './handlers/handler';
import { Commands } from './handlers/commands';
import { Kicks } from './handlers/kicks';
import { Votes } from './handlers/votes';

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log' }),
    ],
    format: winston.format.printf((log: any) => `[${log.level.toUpperCase()}] - ${log.message}`),
});

mongoose
    .connect(
        Configs.mongoURI,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    )
    .then(() => logger.log('info', 'MongoDB Connected'))
    .catch(err => logger.log('error', err));

const client = new Discord.Client({ partials: ['REACTION', 'MESSAGE'] });
const handlers = new Discord.Collection<string, Handler>();

handlers.set('zap', new Zaps(client, logger));
handlers.set('points', new Points(client, logger));
handlers.set('commands', new Commands(client, logger));
handlers.set('votes', new Votes(client, logger));
handlers.set('kicks', new Kicks(client, logger));

handlers.forEach(handler => {
    handler.On();
});

client.once('ready', () => {
    logger.log('info', 'Ready!');

});

process.on('uncaughtException', error => logger.log('error', error));

process.on('unhandledRejection', error => {
    logger.log('error', error);
});

client.login(Configs.token);
