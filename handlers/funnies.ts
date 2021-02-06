import { Client, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';

let bot_talk: TextChannel;

export class Funnies extends Handler {

    constructor(client: Client) {
        super(client, 'funnies', false, true);
        bot_talk = <TextChannel>client.channels.cache.get(Configs.channel_bot_talk);
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        //no funny moments to messages from the bot
        if (reaction.message.author.bot) {
            return;
        }

        //Only the prefects can mark something to be funny
        const guild = reaction.message.guild;
        if (!guild) {
            logger.log('error', `[${this.name}]: Error getting the guild of the reaction`);
            return;
        }

        const guild_member = await guild.members.fetch(reaction.message.author.id);
        const prefect_member = await guild.members.fetch(user.id);

        if (!guild_member) {
            logger.log('error', `[${this.name}]: Error getting the guildmember`);
            return;
        }
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

            stat.funnies.push({ message_id: reaction.message.id, channel_id: reaction.message.channel.id });
            bot_talk.send({
                content: `The funny moment was saved: \n\n${reaction.message.content}`,
                files: reaction.message.attachments.array()
            });

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: The funny moment was saved: \n\n${reaction.message.content}`);

                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

        });

    }

};


module.exports = (client: Client) => {
    return new Funnies(client);
}