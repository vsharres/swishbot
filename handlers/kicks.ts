import { Message } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import { Configs } from '../config/configs';

export class Kicks extends Handler {

    constructor() {
        super('kicks', 'handler to get all of the zap questions');
    }

    async OnMessage(message: Message) {

        //Only respond to messages from the eric munch bot and to messages in the mod talk channel
        if (message.author.id !== Configs.id_eric_munch ||
            message.channel.id !== Configs.channel_mod_talk) return;

        message.channel.send(Configs.gif_peace);
        logger.log('info', `[${this.name}]: ${message.content}`);

    }

};

export default new Kicks();
