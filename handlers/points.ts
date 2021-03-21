import { Client, Guild, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { AddPointsToMember } from '../tools/add_points';

export class Points extends Handler {

    hourglass_channel: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, 'points', false, true);

        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        //No reactions on your own message or no points given to a bot message
        if (reaction.message.author.id === user.id || reaction.message.author.bot) {
            return;
        }

        //Only the founderscan add points to houses.

        const admin_member = await this.guild.members.fetch(user.id);
        const guild_member = await this.guild.members.fetch(reaction.message.author.id);

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

            stat.points = AddPointsToMember(points, stat.points, guild_member);

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: ${Math.abs(points)} points ${points > 0 ? 'awarded' : 'removed'} by ${admin_member.displayName} to ${guild_member.displayName}`);

                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));


            printPoints(this.hourglass_channel, stat.points, true);

        });

    }

};


module.exports = (client: Client) => {
    return new Points(client);
}