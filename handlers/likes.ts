import { Client, TextChannel } from 'discord.js';
import { Logger } from 'winston';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';

export class Votes extends Handler {
    constructor(client: Client, logger: Logger) {
        super('likes', 'handles the voting of zap questions on the bot talk channel', client, logger);
    }

    async On() {
        const client = this.client;
        const logger = this.logger;

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.partial) {

                try {
                    await reaction.fetch();
                }
                catch (error) {
                    logger.log('error', `Something went wrong when fetching the message: ${error}`);
                    return;
                }
            }

            if (user.partial) {

                try {
                    await user.fetch();

                }
                catch (error) {
                    logger.log('error', `Something went wrong when fetching the user: ${error}`);
                    return;
                }
            }
            const message = reaction.message;

            if (message.author.bot) return;

            if (message.reactions.cache.array().length < Configs.number_reactions) return;






        });
    }

}
