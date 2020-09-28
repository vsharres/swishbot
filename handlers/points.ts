import { Client, TextChannel } from 'discord.js';
import { Logger } from 'winston';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';

export class Points extends Handler {

    constructor(client: Client, logger: Logger) {
        super('handler to get reactions from the heads of house and the head pupil', client, logger);
    }

    async On() {
        const client = this.client;
        const logger = this.logger;

        //Checking for reactions
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

            //Only the founders and the head pupil can add points to houses. The head pupil can't give points to itself.
            const guild = reaction.message.guild;
            if (!guild) {
                logger.log('error', `error getting the guild of the reaction`);
                return;
            }
            const guildMember = guild.members.cache.get(user.id);
            const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);

            //No reactions on your own message
            if (reaction.message.author.id === user.id) {
                return;
            }

            if (!guildMember) {
                logger.log('error', `error getting the guildmemers`);
                return;
            }
            const roles = guildMember.roles.cache;
            const adminRole = roles.has(Configs.role_admin);
            const headRole = roles.has(Configs.role_head_pupil);

            if (adminRole === false && headRole === false) {
                return;
            }

            const member = reaction.message.member;
            if (!member) {
                return;
            }

            let points = 0;

            const emoji = reaction.emoji.toString();
            if (emoji === Configs.emoji_addpoints) {
                points = 10;
            }
            else if (emoji === Configs.emoji_removepoints) {
                points = -10;
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
                pointsToAdd.gryffindor += points;
            }
            else if (memberRoles.has(Configs.role_slytherin)) {
                pointsToAdd.slytherin += points;
            }
            else if (memberRoles.has(Configs.role_ravenclaw)) {
                pointsToAdd.ravenclaw += points;
            }
            else if (memberRoles.has(Configs.role_hufflepuff)) {
                pointsToAdd.hufflepuff += points;
            }

            //Return if there is no points to add, this is a sanity check, in the usual mode, this wouldn't be a problem
            if (pointsToAdd.gryffindor === 0 && pointsToAdd.slytherin === 0 && pointsToAdd.ravenclaw === 0 && pointsToAdd.hufflepuff === 0) return;

            Stat.findById(Configs.stats_id).then((stat) => {
                if (!stat) {
                    return;
                }
                const elapsed_time = Math.abs(Date.now() - stat.recording_date.getTime());

                if (elapsed_time > 43200000) {
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
                        logger.log('info', 'Points saved!');

                    })
                    .catch(err => logger.log('error', err));

                printPoints(hourglass_channel, points, logger, true);

            });

        });
    }

};