import Discord, { User } from 'discord.js';
import mongoose from 'mongoose';
import { Configs } from './config/configs';
import handlers from './handlers/handlers';
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

client.once('ready', () => {
    logger.log('info', 'Ready!');

});
client.on('message', async message => {

    handlers.OnMessage(message);

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
    handlers.OnReaction(user as User, reaction);

});


process.on('uncaughtException', error => logger.log('error', error));

process.on('unhandledRejection', error => {
    logger.log('error', error);
});

client.login(Configs.token);
