import { Client, Events, Message } from 'discord.js';
import logger from '../tools/logger';
import { Event } from '../bot-types';
import { Configs } from '../config/configs';

export class Kicks extends Event {

    constructor(client: Client) {
        super(client, 'kicks', Events.MessageCreate, true);
    }

    async execute(message: Message) {

        //Only respond to messages from the eric munch bot and to messages in the mod talk channel
        if (message.author.id !== Configs.eric_munch_id ||
            message.channel.id !== Configs.channel_mod_talk) return;

        message.channel.send(Configs.gif_peace);
        logger.log('info', `[${this.name}]: ${message.content}`);

    }

};

module.exports = (client: Client) => {
    return new Kicks(client);
}
