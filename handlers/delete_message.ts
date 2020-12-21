import { Client, Message, MessageAttachment, TextChannel } from 'discord.js';
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

        const guild = message.guild;
        if (!guild) return;
        const member = guild.members.cache.get(message.author.id);
        if (!member) return;

        if (member.roles.cache.get(Configs.role_prefect) || member.roles.cache.get(Configs.role_admin)) return;

        const content = `${message.author.toString()}'s message: \n\n "${message.content}" \n\nDeleted from the channel: ${message.channel.toString()}`;

        bot_talk.send({
            content: content,
            files: message.attachments.array()

        });

        logger.log('info', `[${this.name}]: ${content}`);

    }

};


module.exports = (client: Client) => {
    return new DeleteMessage(client);
}