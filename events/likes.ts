import { Client, Events, Guild, MessageReaction, PartialMessageReaction, PartialUser, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { BotEvent } from '../bot-types';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { AddPointsToMember } from '../tools/add_points';

export class Likes extends BotEvent {

    hourglass_channel: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, 'likes', Events.MessageReactionAdd, true);

        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async execute(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {

        if (reaction.partial) {

            try {
                await reaction.fetch();
            }
            catch (error) {
                logger.log('error', `[${this.name}]: Something went wrong when fetching the reaction: ${error}`);
                return;
            }
        }

        if ((reaction.message.author as User).bot) return;

        if (Configs.emojis_negative_reactions.some(emoji => reaction.emoji.toString() === emoji)) {
            return;
        }

        if (user.partial) {

            try {
                await user.fetch();

            }
            catch (error) {
                logger.log('error', `[${this.name}]: Something went wrong when fetching the user: ${error}`);
                return;
            }
        }

        Stat.findById(Configs.stats_id).then(async (stat) => {
            if (!stat) {
                return;
            }

            if (stat.annoying_users.some((annoying) => annoying == reaction.message.author?.id)) {
                logger.log('info', `[${this.name}]: Likes from ${user.toString()} ignored. `);
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
                if (value % Configs.number_reactions === 0) {

                    const reaction_member = await this.guild.members.fetch(reaction.message.author as User);

                    const points = AddPointsToMember(Configs.points_likes, stat.points, reaction_member);
                    stat.points.gryffindor = points.gryffindor;
                    stat.points.hufflepuff = points.hufflepuff;
                    stat.points.slytherin = points.slytherin;
                    stat.points.ravenclaw = points.ravenclaw;

                    printPoints(this.hourglass_channel, stat.points, true);

                    logger.log('info', `[${this.name}]: Points awarded to ${reaction_member.displayName} as the message: "${reaction.message.content}" reached ${value} reactions! `);

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
                .catch(err => logger.log('error', `[${this.name}]:${err}`));

        });


    }
}


export default (client: Client) => { return new Likes(client); }