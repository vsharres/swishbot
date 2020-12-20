import { Client, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { addPoints } from '../tools/add_points';

export class Likes extends Handler {
    constructor(client: Client) {
        super(client, 'likes', false, true);
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        //Can only vote on the bot talk channel, ignore bot messages and only consider lightningbolts
        if (reaction.message.author.bot) return;

        if (Configs.emojis_negative_reactions.some(emoji => reaction.emoji.toString() === emoji)) return;

        Stat.findById(Configs.stats_id).then((stat) => {
            if (!stat) {
                return;
            }

            const message_id = reaction.message.id;

            let authors_array = stat.likes.get(message_id);
            if (authors_array) {

                if (authors_array.authors.some(author => author === user.id)) {
                    return;
                }

                let value = authors_array.authors.length;
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

                    logger.log('info', `[${this.name}]: Points awarded to ${reaction_member.displayName} as the message: "${reaction.message.content}" reached ${Configs.number_reactions} reactions! `);

                }

                authors_array.authors.push(user.id);
                stat.likes.set(message_id, authors_array);

            }
            else {
                authors_array = { authors: [] };
                authors_array.authors.push(user.id);
                stat.likes.set(message_id, authors_array);
            }

            stat
                .save()
                .catch(err => logger.log('error', err));


        });


    }
}


module.exports = (client: Client) => {
    return new Likes(client);
}