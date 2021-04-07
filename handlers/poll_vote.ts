import { Client, Guild, MessageReaction, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';

export class PollVote extends Handler {

    constructor(client: Client) {
        super(client, 'poll_votes', false, true);

    }

    async OnReaction(user: User, reaction: MessageReaction) {

        //Can only vote on the poll channel and ignore bot reactions.
        if (user.bot || reaction.message.channel.id !== Configs.channel_polls) return;

        Stat.findById(Configs.stats_id).then(async (stat) => {
            if (!stat) {
                return;
            }

            const poll_index = stat.polls.findIndex(poll => poll.poll_id === reaction.message.id);
            if (poll_index === -1) {
                return;
            }

            //A voter can only vote once
            if (stat.polls[poll_index].voters.some(voter => voter === user.id)) {
                return;
            }

            const option_index = stat.polls[poll_index].options.findIndex(option => option.emoji_id === reaction.emoji.toString());
            if (option_index === -1) {
                return;
            }

            stat.polls[poll_index].options[option_index].votes++;
            stat.polls[poll_index].voters.push(user.id);
            logger.log('info', `[${this.name}]: Vote added to the Poll: ${stat.polls[poll_index].poll_id} with the emoji: ${stat.polls[poll_index].options[option_index].emoji_id}`);

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]:${err}`));

        });


    }
}


module.exports = (client: Client) => {
    return new PollVote(client);
}