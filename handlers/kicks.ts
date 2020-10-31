import { Client } from 'discord.js';
import { Logger } from 'winston';
import { Handler } from './handler';
import { Configs } from '../config/configs';

export class Kicks extends Handler {

    constructor(client: Client, logger: Logger) {
        super('kicks', 'handler to get all of the zap questions', client, logger);
    }

    async On() {
        const client = this.client;
        //Listening to server kicks
        client.on('message', async message => {
            //Only respond to messages from the eric munch bot and to messages in the mod talk channel
            if (message.author.id !== Configs.id_eric_munch ||
                message.channel.id !== Configs.channel_mod_talk) return;

            message.channel.send(Configs.gif_peace);
            this.logger.log('info', `[${this.name}]: ${message.content}`);

        });
    }

};
