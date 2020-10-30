import { Client, TextChannel } from 'discord.js';
import { Logger } from 'winston';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';

export class Likes extends Handler {
    constructor(client: Client, logger: Logger) {
        super('likes', 'handles the voting of zap questions on the bot talk channel', client, logger);
    }

    async On() {
        const client = this.client;
        const logger = this.logger;

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.partial) {

                try {
                    await reaction.fetch();
                }
                catch (error) {
                    logger.log('error', `Something went wrong when fetching the message: ${error}`);
                    return;
                }
            }

            if (user.partial) {

                try {
                    await user.fetch();

                }
                catch (error) {
                    logger.log('error', `Something went wrong when fetching the user: ${error}`);
                    return;
                }
            }
            const message = reaction.message;

            if (!message) return;

            if (message.author.bot) return;

            if (message.reactions.cache.entries.length < Configs.number_reactions) return;

            let time_since_message = Date.now() - message.createdAt.getTime();
            time_since_message = time_since_message / (1000 * 60 * 60);

            //Only count messages that happened during the recording
            if (time_since_message > Configs.recording_delay) return;

            let pointsToAdd = {
                gryffindor: 0,
                slytherin: 0,
                ravenclaw: 0,
                hufflepuff: 0
            };
            const member = reaction.message.member;
            if (!member) return;

            const memberRoles = member.roles.cache;
            let points = 0;

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

                const guild = reaction.message.guild;
                if (!guild) return;

                const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);

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
                        logger.log('info', `Points for ${Configs.number_reactions} reactions! Points modified by: gryffindor:${pointsToAdd.gryffindor} slytherin:${pointsToAdd.slytherin} ravenclaw:${pointsToAdd.ravenclaw} hufflepuff:${pointsToAdd.hufflepuff}`);

                    })
                    .catch(err => logger.log('error', err));

                printPoints(hourglass_channel, points, logger, true);

            });

        });
    }

}
