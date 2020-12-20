import { Client, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import { Configs } from '../config/configs';

let bot_talk: TextChannel;

export class DeleteMessage extends Handler {

    constructor(client: Client) {
        super(client, 'delete', false, false, false, true);
        bot_talk = <TextChannel>client.channels.cache.get(Configs.channel_bot_talk)
    }

    async OnMessageDelete(message: Message) {

        //Only respond to messages from the eric munch bot and to messages in the mod talk channel
        if (message.author.bot) return;

        bot_talk.send(`${message.author.toString()} message: \n\n "${message.content}" \n\nDeleted from the channel: ${message.channel.toString()} `);

        logger.log('info', `[${this.name}]: ${message.author.toString()} message: \n\n "${message.content}" \n\nDeleted from the channel: ${message.channel.toString()}`);

    }

};


module.exports = (client: Client) => {
    return new DeleteMessage(client);
}