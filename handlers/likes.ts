import { MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { addPoints } from '../tools/add_points';

export class Likes extends Handler {
    constructor() {
        super('likes', false, true);
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        //Can only vote on the bot talk channel, ignore bot messages and only consider lightningbolts
        if (reaction.message.author.bot) return;

        Stat.findById(Configs.stats_id).then((stat) => {
            if (!stat) {
                return;
            }

            const message_id = reaction.message.id;

            let value = stat.likes.get(message_id);
            if (value) {
                //Increment the value of reactions
                value++;
                if (value === Configs.number_reactions) {

                    const guild = reaction.message.guild;
                    if (!guild) {
                        logger.log('error', `[${this.name}]: Error getting the guild of the reaction`);
                        return;
                    }

                    const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);
                    const reaction_member = guild.members.cache.get(reaction.message.author.id);
                    if (!reaction_member) {
                        return;
                    }

                    stat.points = addPoints(Configs.points_likes, stat.points, reaction_member);

                    printPoints(hourglass_channel, stat.points, true);

                    logger.log('info', `[${this.name}]: Points awarded as the message: "${reaction.message.content}" reached ${Configs.number_reactions} reactions! `);

                }

                stat.likes.set(message_id, value);

            }
            else {
                stat.likes.set(message_id, 1);
            }


            stat
                .save()
                .catch(err => logger.log('error', err));


        });


    }
}

export default new Likes();