import { Client, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { addPoints } from '../tools/add_points';

export class Points extends Handler {

    constructor(client: Client) {
        super(client, 'points', false, true);
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        //No reactions on your own message or no points given to a bot message
        if (reaction.message.author.id === user.id || reaction.message.author.bot) {
            return;
        }

        //Only the founderscan add points to houses.
        const guild = reaction.message.guild;
        if (!guild) {
            logger.log('error', `[${this.name}]: Error getting the guild of the reaction`);
            return;
        }
        const admin_member = await guild.members.fetch(user.id);
        const guild_member = await guild.members.fetch(reaction.message.author.id);

        if (!guild_member) {
            logger.log('error', `[${this.name}]: Error getting the guildmember`);
            return;
        }
        const adminRole = admin_member.roles.cache.has(Configs.role_admin);

        if (adminRole === false) {
            return;
        }

        let points = 0;

        const emoji = reaction.emoji.toString();
        if (Configs.emoji_addpoints.some((addpoint) => addpoint === emoji)) {
            points = Configs.points_likes;
        }
        else if (Configs.emoji_removepoints.some((removepoint) => removepoint === emoji)) {
            points = -Configs.points_likes;
        }
        else {
            return;
        }


        Stat.findById(Configs.stats_id).then((stat) => {
            if (!stat) {
                return;
            }

            stat.points = addPoints(points, stat.points, guild_member);

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: ${Math.abs(points)} points ${points > 0 ? 'awarded' : 'removed'} by ${admin_member.displayName} to ${guild_member.displayName}`);

                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);
            printPoints(hourglass_channel, stat.points);

        });

    }

};


module.exports = (client: Client) => {
    return new Points(client);
}