import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class Poll extends Command {

    constructor(client: Client) {
        super(client, ["poll"], false, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            const poll = stat.polls[stat.polls.length - 1];
            if (!poll) {
                logger.log('error', `[${this.names[0]}]: There are no polls to get.`);
                return;
            }

            let content = `**POLL**\n\n${poll.question}\n\n**RESULTS**\n\n`;
            poll.options.forEach(option => {
                content += `${option.emoji_id} with **${option.votes} votes**\n\n`;
            })

            message.channel.send(content);


        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

    }
};

export default (client: Client) => { return new Poll(client); }