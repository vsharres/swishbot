import { MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';

export class Likes extends Handler {
    constructor() {
        super('likes', 'handles the likes to general messages', false, true);
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

                    let pointsToAdd = {
                        gryffindor: 0,
                        slytherin: 0,
                        ravenclaw: 0,
                        hufflepuff: 0
                    };

                    //Only the founderscan add points to houses.
                    const guild = reaction.message.guild;
                    if (!guild) {
                        logger.log('error', `[${this.name}]: Error getting the guild of the reaction`);
                        return;
                    }

                    const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);
                    const reaction_member = guild.members.cache.get(reaction.message.author.id);

                    if (!reaction_member) return;
                    const memberRoles = reaction_member.roles.cache;

                    if (memberRoles.has(Configs.role_gryffindor)) {
                        pointsToAdd.gryffindor += Configs.points_reactions;
                    }

                    if (memberRoles.has(Configs.role_slytherin)) {
                        pointsToAdd.slytherin += Configs.points_reactions;
                    }

                    if (memberRoles.has(Configs.role_ravenclaw)) {
                        pointsToAdd.ravenclaw += Configs.points_reactions;
                    }

                    if (memberRoles.has(Configs.role_hufflepuff)) {
                        pointsToAdd.hufflepuff += Configs.points_reactions;
                    }


                    stat.points.gryffindor += pointsToAdd.gryffindor;
                    if (stat.points.gryffindor <= 0) stat.points.gryffindor = 0;
                    stat.points.ravenclaw += pointsToAdd.ravenclaw;
                    if (stat.points.ravenclaw <= 0) stat.points.ravenclaw = 0;
                    stat.points.slytherin += pointsToAdd.slytherin;
                    if (stat.points.slytherin <= 0) stat.points.slytherin = 0;
                    stat.points.hufflepuff += pointsToAdd.hufflepuff;
                    if (stat.points.hufflepuff <= 0) stat.points.hufflepuff = 0;

                    printPoints(hourglass_channel, stat.points, true);
                    logger.log('info', `[${this.name}]: Points modified by: gryffindor:${pointsToAdd.gryffindor} slytherin:${pointsToAdd.slytherin} ravenclaw:${pointsToAdd.ravenclaw} hufflepuff:${pointsToAdd.hufflepuff}`);

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