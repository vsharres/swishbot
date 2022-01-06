import { Client, Guild, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { addPointsRandomHouse, AddPointsToMember } from '../tools/add_points';

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
        const author = reaction.message.author as User;
        if (!author || author.id === user.id || author.bot) {
            return;
        }

        const point_giver_member = await this.guild.members.fetch(user.id);
        const message_author_member = await this.guild.members.fetch(author.id);

        const can_give_points = point_giver_member.roles.cache.has(Configs.role_admin);

        //Only founders can give out points
        if (!can_give_points) {
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

            if (Configs.chaos) {

                const author_roles = message_author_member.roles.cache;
                let member_house: string;

                if (author_roles.has(Configs.role_slytherin)) {
                    member_house = Configs.role_slytherin;
                }
                else if (author_roles.has(Configs.role_gryffindor)) {
                    member_house = Configs.role_gryffindor;
                }
                else if (author_roles.has(Configs.role_ravenclaw)) {
                    member_house = Configs.role_ravenclaw;
                }
                else if (author_roles.has(Configs.role_hufflepuff)) {
                    member_house = Configs.role_hufflepuff;
                }
                else {
                    return;
                }

                const total_points = addPointsRandomHouse(points, stat.points, member_house);
                stat.points.gryffindor = total_points.gryffindor;
                stat.points.hufflepuff = total_points.hufflepuff;
                stat.points.slytherin = total_points.slytherin;
                stat.points.ravenclaw = total_points.ravenclaw;   

            }
            else {
                const total_points = AddPointsToMember(points, stat.points, message_author_member);
                stat.points.gryffindor = total_points.gryffindor;
                stat.points.hufflepuff = total_points.hufflepuff;
                stat.points.slytherin = total_points.slytherin;
                stat.points.ravenclaw = total_points.ravenclaw;
            }

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: ${Math.abs(points)} points ${points > 0 ? 'awarded' : 'removed'} by ${point_giver_member.displayName} to ${message_author_member.displayName}`);

                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));


            printPoints(this.hourglass_channel, stat.points, true);

        });

    }

};


module.exports = (client: Client) => {
    return new Points(client);
}