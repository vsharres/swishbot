import { MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';

export class Votes extends Handler {
    constructor() {
        super('votes', 'handles the voting of zap questions on the bot talk channel');
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        const message = reaction.message;
        //Can only vote on the bot talk channel, ignore bot messages and only consider lightningbolts
        if (!message.content.startsWith('⚡')) return;

        //Only the founderscan add points to houses.
        const guild = reaction.message.guild;
        if (!guild) {
            logger.log('error', `[${this.name}]: Error getting the guild of the reaction`);
            return;
        }
        const guildMember = await guild.members.fetch(user.id);

        if (!guildMember) {
            logger.log('error', `[${this.name}]: Error getting the guildmembers`);
            return;
        }
        const isPrefect = guildMember.roles.cache.has(Configs.role_prefect);
        if (!isPrefect) {
            return;
        }

        const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);

        let votes = 0;
        const emoji = reaction.emoji.toString();
        if (Configs.emojis_vote_yes.some((yes) => yes === emoji)) {
            votes++;
        }
        else if (Configs.emojis_vote_no.some((no) => no === emoji)) {
            votes--;
        }
        else {
            return;
        }

        Stat.findById(Configs.stats_id).then((stat) => {
            if (!stat) {
                return;
            }

            let zapIndex = stat.lightnings.findIndex((zap) => zap.question === message.content);
            if (zapIndex == -1) {
                return;
            }
            const zap = stat.lightnings[zapIndex];
            zap.votes += votes;

            if (!zap.was_awarded && (zap.votes >= 3 || zap.votes <= -3)) {

                let pointsToAdd = {
                    gryffindor: 0,
                    slytherin: 0,
                    ravenclaw: 0,
                    hufflepuff: 0
                };
                const zapmember = guild.members.cache.get(zap.member);
                if (!zapmember) return;
                const memberRoles = zapmember.roles.cache;

                let points;
                if (memberRoles.has(Configs.role_gryffindor)) {
                    points = Configs.points_votes * Math.sign(zap.votes);
                    pointsToAdd.gryffindor += points;
                }
                else if (memberRoles.has(Configs.role_slytherin)) {
                    points = Configs.points_votes * Math.sign(zap.votes);
                    pointsToAdd.slytherin += points;
                }
                else if (memberRoles.has(Configs.role_ravenclaw)) {
                    points = Configs.points_votes * Math.sign(zap.votes);
                    pointsToAdd.ravenclaw += points;
                }
                else if (memberRoles.has(Configs.role_hufflepuff)) {
                    points = Configs.points_votes * Math.sign(zap.votes);
                    pointsToAdd.hufflepuff += points;
                }
                else {
                    return;
                }

                stat.points.gryffindor += pointsToAdd.gryffindor;
                if (stat.points.gryffindor <= 0) stat.points.gryffindor = 0;
                stat.points.ravenclaw += pointsToAdd.ravenclaw;
                if (stat.points.ravenclaw <= 0) stat.points.ravenclaw = 0;
                stat.points.slytherin += pointsToAdd.slytherin;
                if (stat.points.slytherin <= 0) stat.points.slytherin = 0;
                stat.points.hufflepuff += pointsToAdd.hufflepuff;
                if (stat.points.hufflepuff <= 0) stat.points.hufflepuff = 0;

                zap.was_awarded = true;
                printPoints(hourglass_channel, stat.points, true);

            }

            stat.lightnings[zapIndex] = zap;

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: Votes modified by ${votes}`);

                })
                .catch(err => logger.log('error', err));


        });


    }
}

export default new Votes();