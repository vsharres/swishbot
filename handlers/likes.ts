import { MessageReaction, TextChannel, User, Message } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';

export class Likes extends Handler {

    constructor() {
        super('likes', 'handles the voting of zap questions on the bot talk channel');

    }

    async OnMessage(message: Message) {
        if (message.author.bot) return;

        const filter = (reaction: MessageReaction, user: User) => true;
        message.awaitReactions(filter, { time: parseInt(Configs.reactions_timer), max: Configs.number_reactions })
            .then(collected => {
                if (collected.size < Configs.number_reactions) return;

                const message_guild = message.guild;
                if (!message_guild) {
                    logger.log('error', `[${this.name}]: Error getting the guild of the reaction`);
                    return;
                }

                const guild_member = message_guild.members.cache.get(message.author.id);
                if (!guild_member) {
                    return logger.log('error', `[${this.name}]: Something went wrong when getting the member`);
                }

                const memberRoles = guild_member.roles.cache;

                let points = 0;
                let pointsToAdd = {
                    gryffindor: 0,
                    slytherin: 0,
                    ravenclaw: 0,
                    hufflepuff: 0
                };

                if (memberRoles.has(Configs.role_gryffindor)) {
                    points = Configs.gryffindor_points_multiplier;
                    pointsToAdd.gryffindor += points;
                }
                else if (memberRoles.has(Configs.role_slytherin)) {
                    points = Configs.slytherin_points_multiplier;
                    pointsToAdd.slytherin += points;
                }
                else if (memberRoles.has(Configs.role_ravenclaw)) {
                    points = Configs.ravenclaw_points_multiplier;
                    pointsToAdd.ravenclaw += points;
                }
                else if (memberRoles.has(Configs.role_hufflepuff)) {
                    points = Configs.hufflepuff_points_multiplier;
                    pointsToAdd.hufflepuff += points;
                }
                else {
                    return;
                }

                Stat.findById(Configs.stats_id).then((stat) => {
                    if (!stat) {
                        return;
                    }

                    const hourglass_channel = <TextChannel>message_guild.channels.cache.get(Configs.channel_house_points);

                    let points = stat.points;
                    points.gryffindor += pointsToAdd.gryffindor;
                    if (points.gryffindor <= 0) points.gryffindor = 0;
                    points.ravenclaw += pointsToAdd.ravenclaw;
                    if (points.ravenclaw <= 0) points.ravenclaw = 0;
                    points.slytherin += pointsToAdd.slytherin;
                    if (points.slytherin <= 0) points.slytherin = 0;
                    points.hufflepuff += pointsToAdd.hufflepuff;
                    if (points.hufflepuff <= 0) points.hufflepuff = 0;

                    stat
                        .save()
                        .then(() => {
                            logger.log('info', `[${this.name}]: Points for ${Configs.number_reactions} reactions! Points modified by: gryffindor:${pointsToAdd.gryffindor} slytherin:${pointsToAdd.slytherin} ravenclaw:${pointsToAdd.ravenclaw} hufflepuff:${pointsToAdd.hufflepuff}`);

                        })
                        .catch(err => logger.log('error', `[${this.name}]: ${err}`));

                    printPoints(hourglass_channel, points, true);

                });

            })
            .catch(error => logger.error(`[${this.name}]: ${error}`));


    }

}

export default new Likes();
