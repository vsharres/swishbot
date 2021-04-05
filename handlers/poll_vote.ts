import { Client, Guild, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';

export class PollVote extends Handler {

    hourglass_channel: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, 'poll_votes', false, true);

        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async OnReaction(user: User, reaction: MessageReaction) {

        //Can only vote on the bot talk channel, ignore bot messages and only consider lightningbolts
        if (reaction.message.author.bot) return;

        Stat.findById(Configs.stats_id).then(async (stat) => {
            if (!stat) {
                return;
            }

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]:${err}`));

        });


    }
}


module.exports = (client: Client) => {
    return new PollVote(client);
}