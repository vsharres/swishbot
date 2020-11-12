import Discord, { User } from 'discord.js';
import mongoose from 'mongoose';
import { Configs } from './config/configs';
import winston from 'winston';
import { Zaps } from './handlers/zaps';
import { Points } from './handlers/points';
import { Handler } from './handlers/handler';
import { Commands } from './handlers/commands';
import { Kicks } from './handlers/kicks';
import { Votes } from './handlers/votes';
import { Likes } from './handlers/likes';

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

const client = new Discord.Client({ partials: ['REACTION', 'MESSAGE', 'USER', 'GUILD_MEMBER'] });
const handlers = new Discord.Collection<string, Handler>();

handlers.set('zap', new Zaps(logger));
handlers.set('points', new Points(logger));
handlers.set('commands', new Commands(logger));
handlers.set('votes', new Votes(logger));
handlers.set('kicks', new Kicks(logger));
handlers.set('likes', new Likes(logger));

client.once('ready', () => {
    logger.log('info', 'Ready!');

});
client.on('message', async message => {

    handlers.forEach(handler => {
        handler.OnMessage(message);
    });

});

//NEED TO CHANGE THAT
//Checking for reactions
client.on('messageReactionAdd', async (reaction, user) => {

    if (reaction.partial) {

        try {
            await reaction.fetch();
        }
        catch (error) {
            logger.log('error', `[Index]: Something went wrong when fetching the message: ${error}`);
            return;
        }
    }

    if (user.partial) {

        try {
            await user.fetch();

        }
        catch (error) {
            logger.log('error', `[Index]: Something went wrong when fetching the user: ${error}`);
            return;
        }
    }

    handlers.forEach(handler => {
        handler.OnReaction(user as User, reaction);
    });

});

process.on('uncaughtException', error => logger.log('error', error));

process.on('unhandledRejection', error => {
    logger.log('error', error);
});

client.login(Configs.token);
