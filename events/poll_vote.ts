import { Client, Events, Guild, MessageReaction, PartialMessageReaction, PartialUser, TextChannel, User } from 'discord.js';
import logger from '../tools/logger';
import { Event } from '../bot-types';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { addPointsToHouse } from '../tools/add_points';

export class PollVote extends Event {

    guild: Guild;
    hourglass_channel: TextChannel;

    constructor(client: Client) {
        super(client, 'poll_votes', Events.MessageReactionAdd, true);

        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;

    }

    async execute(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {

        if (reaction.partial) {

            try {
                await reaction.fetch();
            }
            catch (error) {
                logger.log('error', `[${this.name}]: Something went wrong when fetching the reaction: ${error}`);
                return;
            }
        }

        if (user.partial) {

            try {
                await user.fetch();

            }
            catch (error) {
                logger.log('error', `[${this.name}]: Something went wrong when fetching the user: ${error}`);
                return;
            }
        }

        //Can only vote on the poll channel and ignore bot reactions.
        if (user.bot || reaction.message.channel.id !== Configs.channel_polls) return;

        Stat.findById(Configs.stats_id).then(async (stat) => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the database.`);
                return;
            }

            const poll_index = stat.polls.findIndex(poll => poll.poll_id === reaction.message.id);
            if (poll_index === -1) {
                logger.log('warn', `[${this.name}]: Couldn't find a poll with the id: ${reaction.message.id}`);
                return;
            }

            //A voter can only vote once
            if (stat.polls[poll_index].voters.some(voter => voter === user.id)) {
                return;
            }

            const option_index = stat.polls[poll_index].options.findIndex(option => option.emoji_id === reaction.emoji.toString());
            if (option_index === -1) {
                logger.log('warn', `[${this.name}]: Couldn't find a poll the emoji option provided to the poll`);
                return;
            }

            const guildmember = await this.guild.members.fetch(user.id);
            let house = '';

            if (guildmember.roles.cache.has(Configs.role_slytherin)) {
                stat.polls[poll_index].options[option_index].votes.slytherin++;
                house = Configs.role_slytherin;
            }
            else if (guildmember.roles.cache.has(Configs.role_gryffindor)) {
                stat.polls[poll_index].options[option_index].votes.gryffindor++;
                house = Configs.role_gryffindor;
            }
            else if (guildmember.roles.cache.has(Configs.role_ravenclaw)) {
                stat.polls[poll_index].options[option_index].votes.ravenclaw++;
                house = Configs.role_ravenclaw;
            }
            else if (guildmember.roles.cache.has(Configs.role_hufflepuff)) {
                stat.polls[poll_index].options[option_index].votes.hufflepuff++;
                house = Configs.role_hufflepuff;
            }
            else {
                //There is no house role
                return;
            }

            const points = addPointsToHouse(Configs.points_votes, stat.points, house);
            stat.points.gryffindor = points.gryffindor;
            stat.points.hufflepuff = points.hufflepuff;
            stat.points.slytherin = points.slytherin;
            stat.points.ravenclaw = points.ravenclaw;
            stat.polls[poll_index].voters.push(user.id);

            printPoints(this.hourglass_channel, stat.points, true);

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