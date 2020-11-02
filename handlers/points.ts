import { Client, TextChannel } from 'discord.js';
import { Logger } from 'winston';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';

export class Points extends Handler {

    constructor(client: Client, logger: Logger) {
        super('points', 'handler to get reactions from the heads of house and the head pupil', client, logger);
    }

    async On() {
        const client = this.client;
        const logger = this.logger;

        //Checking for reactions
        client.on('messageReactionAdd', async (reaction, user) => {

            if (reaction.partial) {

                try {
                    reaction = await reaction.fetch();
                }
                catch (error) {
                    logger.log('error', `[${this.name}]: Something went wrong when fetching the message: ${error}`);
                    return;
                }
            }

            if (user.partial) {

                try {
                    user = await user.fetch();

                }
                catch (error) {
                    logger.log('error', `[${this.name}]: Something went wrong when fetching the user: ${error}`);
                    return;
                }
            }

            if (reaction.message.partial) {
                try {
                    await reaction.message.fetch(true);

                }
                catch (error) {
                    logger.log('error', `[${this.name}]: Something went wrong when fetching the reaction message: ${error}`);
                    return;
                }
            }

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
            const guild_members = await guild.members.fetch();
            const guild_member = guild_members.get(user.id);

            if (!guild_member) {
                logger.log('error', `[${this.name}]: Error getting the guildmember`);
                return;
            }
            const roles = guild_member.roles.cache;
            const adminRole = roles.has(Configs.role_admin);

            if (adminRole === false) {
                return;
            }

            const member = reaction.message.member;
            if (!member) {
                return;
            }

            let points = 0;

            const emoji = reaction.emoji.toString();
            if (Configs.emoji_addpoints.some((addpoint) => addpoint === emoji)) {
                points = 1;
            }
            else if (Configs.emoji_removepoints.some((removepoint) => removepoint === emoji)) {
                points = -1;
            }
            else {
                return;
            }

            let pointsToAdd = {
                gryffindor: 0,
                slytherin: 0,
                ravenclaw: 0,
                hufflepuff: 0
            };
            const memberRoles = member.roles.cache;

            if (memberRoles.has(Configs.role_gryffindor)) {
                points *= Configs.gryffindor_points_multiplier;
                pointsToAdd.gryffindor += points;
            }
            else if (memberRoles.has(Configs.role_slytherin)) {
                points *= Configs.slytherin_points_multiplier;
                pointsToAdd.slytherin += points;
            }
            else if (memberRoles.has(Configs.role_ravenclaw)) {
                points *= Configs.ravenclaw_points_multiplier;
                pointsToAdd.ravenclaw += points;
            }
            else if (memberRoles.has(Configs.role_hufflepuff)) {
                points *= Configs.hufflepuff_points_multiplier;
                pointsToAdd.hufflepuff += points;
            }
            else {
                return;
            }

            Stat.findById(Configs.stats_id).then((stat) => {
                if (!stat) {
                    return;
                }

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
                        logger.log('info', `[${this.name}]: Points modified by: gryffindor:${pointsToAdd.gryffindor} slytherin:${pointsToAdd.slytherin} ravenclaw:${pointsToAdd.ravenclaw} hufflepuff:${pointsToAdd.hufflepuff}`);

                    })
                    .catch(err => logger.log('error', `[${this.name}]: ${err}`));

                const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);
                printPoints(hourglass_channel, points, logger, true);

            });

        });
    }

};