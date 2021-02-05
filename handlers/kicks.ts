import { Client, Message } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import { Configs } from '../config/configs';

export class Kicks extends Handler {

    constructor(client: Client) {
        super(client, 'kicks', true);
    }

    async OnMessage(message: Message) {

        //Only respond to messages from the eric munch bot and to messages in the mod talk channel
        if (message.author.id !== Configs.id_eric_munch ||
            message.channel.id !== Configs.channel_mod_talk) return;

        message.channel.send(Configs.gif_peace);
        logger.log('info', `[${this.name}]: ${message.content}`);

    }

};

module.exports = (client: Client) => {
    return new Kicks(client);
}
