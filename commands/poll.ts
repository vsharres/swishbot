import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class Poll extends Command {

    constructor(client: Client) {
        super(client, ["poll"], true, false, true);
    }

    async execute(message: Message, arg: string[]) {

        let with_houses = false;
        if (arg.some(arg => arg === '-houses')) {
            with_houses = true;
        }

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
                const number_votes = option.votes.gryffindor + option.votes.ravenclaw + option.votes.hufflepuff + option.votes.slytherin + 1;
                content += `${option.emoji_id} with a total of **${number_votes} ${number_votes === 1 ? 'vote' : 'votes'}**\n\n`;
                if (with_houses) {
                    content += `Gryffindor 🦁 with ${option.votes.gryffindor} ${option.votes.gryffindor === 1 ? 'vote' : 'votes'}\n`;
                    content += `Slytherin 🐍 with ${option.votes.slytherin} ${option.votes.slytherin === 1 ? 'vote' : 'votes'}\n`;
                    content += `Ravenclaw 🦅 with ${option.votes.ravenclaw} ${option.votes.ravenclaw === 1 ? 'vote' : 'votes'}\n`;
                    content += `Hufflepuff 🦡 with ${option.votes.hufflepuff} ${option.votes.hufflepuff === 1 ? 'vote' : 'votes'}\n\n`;
                }

            });

            message.channel.send(content);


        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

    }
};

export default (client: Client) => { return new Poll(client); }