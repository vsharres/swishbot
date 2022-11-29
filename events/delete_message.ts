import { Client, Events, Guild, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { BotEvent } from '../bot-types';
import { Configs } from '../config/configs';

export class DeleteMessage extends BotEvent {

    channel_owlzkabanned: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, 'deletes', Events.MessageDelete, true);
        this.channel_owlzkabanned = client.channels.cache.get(Configs.channel_banned) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async execute(message: Message) {

        //Only respond to messages from the eric munch bot and to messages in the mod talk channel
        if (message.author.bot) return;

        const member = this.guild.members.cache.get(message.author.id);
        if (!member) return;

        if (member.roles.cache.get(Configs.role_prefect) || member.roles.cache.get(Configs.role_admin)) return;

        const content = `${message.author.toString()}'s message: \n\n "${message.content}" \n\nDeleted from the channel: ${message.channel.toString()}`;

        const files = message.attachments.map<string>(attachment => attachment.url);
        this.channel_owlzkabanned.send({
            content: content,
            files: files
        });

        logger.log('info', `[${this.name}]: ${message.author.username}'s message: "${message.content}" Deleted from the channel: ${message.channel.toString()}`);

    }

};

module.exports = (client: Client) => {
    return new DeleteMessage(client);
}