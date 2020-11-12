import { MessageReaction, TextChannel, User, Collection } from 'discord.js';
import { Logger } from 'winston';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { assert } from '../tools/assert';

export class Likes extends Handler {

    liked_messages: Collection<string, string>;

    constructor(logger: Logger) {
        super('likes', 'handles the voting of zap questions on the bot talk channel', logger);
        this.liked_messages = new Collection<string, string>();

        Stat.findById(Configs.stats_id).then((stat) => {
            if (!stat) {
                return;
            }

            if (!stat.liked_messages) {
                stat.liked_messages = new Map<string, string>();
                stat.save();
            }

            stat.liked_messages.forEach((value, key) => {
                this.liked_messages.set(key, value);
            });



        });

    }

    async OnReaction(user: User, reaction: MessageReaction) {
        const logger = this.logger;

        const message = reaction.message;

        if (!message) {
            return logger.log('error', `[${this.name}]: Something went wrong when fetching the message:`);
        }

        if (message.author.bot) return;

        const number_reaction = message.reactions.cache.array().length;
        //assert(number_reaction < Configs.number_reactions, this, logger);

        if (number_reaction < Configs.number_reactions) return;

        if (this.liked_messages.get(message.id)) return;

        let pointsToAdd = {
            gryffindor: 0,
            slytherin: 0,
            ravenclaw: 0,
            hufflepuff: 0
        };

        const guild = reaction.message.guild;
        if (!guild) {
            logger.log('error', `[${this.name}]: Error getting the guild of the reaction`);
            return;
        }

        const guild_member = await guild.members.fetch(reaction.message.author.id);
        if (!guild_member) {
            return logger.log('error', `[${this.name}]: Something went wrong when getting the member`);
        }

        const memberRoles = guild_member.roles.cache;
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

            const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);
            stat.liked_messages.set(message.id, message.id);
            this.liked_messages.set(message.id, message.id);

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
                    logger.log('info', ` [${this.name}]: Points for ${Configs.number_reactions} reactions! Points modified by: gryffindor:${pointsToAdd.gryffindor} slytherin:${pointsToAdd.slytherin} ravenclaw:${pointsToAdd.ravenclaw} hufflepuff:${pointsToAdd.hufflepuff}`);

                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            printPoints(hourglass_channel, points, logger, true);

        });


    }

}
