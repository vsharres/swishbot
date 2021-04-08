import { Client, Guild, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import { Configs } from '../config/configs';

export class Wheeze extends Handler {

    wheeze_channel: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, 'wheezes', false, true);

        this.wheeze_channel = client.channels.cache.get(Configs.channel_wheezes) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        //Can only vote on the bot talk channel
        if (reaction.message.author.bot || reaction.emoji.toString() !== Configs.emoji_wheeze) return;

        const prefect_member = await this.guild.members.fetch(user.id);
        const adminRole = prefect_member.roles.cache.has(Configs.role_prefect);

        if (adminRole === false) {
            return;
        }

        this.wheeze_channel.send({
            content: `${reaction.message.author.toString()}'s message: \n\n${reaction.message.content}`,
            files: reaction.message.attachments.array()
        });

        logger.log('info', `[${this.name}]: Wheeze moment saved: ${reaction.message.id}"`);

    }
}


module.exports = (client: Client) => {
    return new Wheeze(client);
}