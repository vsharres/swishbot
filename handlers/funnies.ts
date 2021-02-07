import { Client, Guild, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';

export class Funnies extends Handler {

    bot_talk: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, 'funnies', false, true);
        this.bot_talk = client.channels.cache.get(Configs.channel_bot_talk) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        //no funny moments to messages from the bot
        if (reaction.message.author.bot) {
            return;
        }

        //Only the prefects can mark something to be funny

        const prefect_member = await this.guild.members.fetch(user.id);
        const adminRole = prefect_member.roles.cache.has(Configs.role_prefect);

        if (adminRole === false) {
            return;
        }

        const emoji = reaction.emoji.toString();

        if (emoji !== '🥸') {
            return;
        }

        Stat.findById(Configs.stats_id).then((stat) => {
            if (!stat) {
                return;
            }

            if (stat.funnies.some(funny => funny.message_id === reaction.message.id)) {
                return;
            }

            stat.funnies.push({ message_id: reaction.message.id, channel_id: reaction.message.channel.id });
            this.bot_talk.send({
                content: `The funny moment was saved:\n\n${reaction.message.content}`,
                files: reaction.message.attachments.array()
            });

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: The funny moment was saved: ${reaction.message.content}`);

                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

        });

    }

};


module.exports = (client: Client) => {
    return new Funnies(client);
}