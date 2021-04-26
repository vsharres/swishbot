import Discord, { Message, User } from 'discord.js';
import mongoose from 'mongoose';
import { Configs } from './config/configs';
import { Handlers } from './handlers/handlers';
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
let handlers: Handlers;

client.once('ready', () => {
    logger.log('info', 'Ready!');
    handlers = require('./handlers/handlers')(client);
});
client.on('message', async message => {

    if (process.env.NODE_ENV == 'development') logger.log('info', '[Index]: On Message event caught');

    handlers.OnMessage(message);

});

client.on('messageDelete', async message => {

    if (message.partial) {
        try {
            await message.fetch();
        }
        catch (error) {
            logger.log('error', `[Index]: Something went wrong when fetching the message: ${error}`);
            return;
        }
    }

    if (process.env.NODE_ENV == 'development') logger.log('info', '[Index]: On Message deleted event caught');

    handlers.OnMessageDelete(message as Message);
});

client.on('guildMemberAdd', member => {
    if (process.env.NODE_ENV == 'development') logger.log('info', '[Index]: On Member added event caught');

    handlers.OnMemberAdd(member);
});

//Checking for reactions
client.on('messageReactionAdd', async (reaction, user) => {

    if (process.env.NODE_ENV == 'development') logger.log('info', '[Index]: Reaction add caught');

    if (reaction.partial) {

        try {
            await reaction.fetch();
        }
        catch (error) {
            logger.log('error', `[Index]: Something went wrong when fetching the reaction: ${error}`);
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
    handlers.OnReaction(user as User, reaction);

});


process.on('uncaughtException', error => logger.log('error', error));

process.on('unhandledRejection', error => {
    logger.log('error', error);
});

client.login(Configs.token);
