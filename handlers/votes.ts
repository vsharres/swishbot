import { Client, Guild, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { addPoints } from '../tools/add_points';

export class Votes extends Handler {

    hourglass_channel: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, 'votes', false, true);
        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        const message = reaction.message;
        //Can only vote on the bot talk channel, ignore bot messages and only consider lightningbolts
        if (!message.content.startsWith('⚡')) return;

        //Only the founderscan add points to houses.

        const guildMember = await this.guild.members.fetch(user.id);

        const isPrefect = guildMember.roles.cache.has(Configs.role_prefect);
        if (!isPrefect) {
            return;
        }

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

            if (!zap.was_awarded && zap.votes <= -3) {

                const zapmember = this.guild.members.cache.get(zap.member);
                if (!zapmember) return;

                stat.points = addPoints(Configs.points_votes * Math.sign(zap.votes), stat.points, zapmember);

                zap.was_awarded = true;
                printPoints(this.hourglass_channel, stat.points, true);

            }

            stat.lightnings[zapIndex] = zap;

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: Votes modified by ${votes} for the message: "${reaction.message.content}"`);

                })
                .catch(err => logger.log('error', err));


        });


    }
}

module.exports = (client: Client) => {
    return new Votes(client);
}