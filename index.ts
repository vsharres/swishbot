import Discord, { User } from 'discord.js';
import mongoose from 'mongoose';
import { Configs } from './config/configs';
import { Zaps } from './handlers/zaps';
import { Points } from './handlers/points';
import { Handler } from './handlers/handler';
import { Commands } from './handlers/commands';
import { Kicks } from './handlers/kicks';
import { Votes } from './handlers/votes';
import { Likes } from './handlers/likes';
import logger from './tools/logger';

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

handlers.set('zap', new Zaps());
handlers.set('points', new Points());
handlers.set('commands', new Commands());
handlers.set('votes', new Votes());
handlers.set('kicks', new Kicks());
handlers.set('likes', new Likes());

client.once('ready', () => {
    logger.log('info', 'Ready!');

});
client.on('message', async message => {

    handlers.forEach(async handler => {
        handler.OnMessage(message);
    });

});

//NEED TO CHANGE THAT
//Checking for reactions
client.on('messageReactionAdd', async (reaction, user) => {

    if (process.env.NODE_ENV == 'development') logger.log('info', 'Reaction caught');

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
    handlers.forEach(async handler => {
        handler.OnReaction(user as User, reaction);
    });

});


process.on('uncaughtException', error => logger.log('error', error));

process.on('unhandledRejection', error => {
    logger.log('error', error);
});

client.login(Configs.token);
