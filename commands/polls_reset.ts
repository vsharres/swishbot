import Stat, { Poll } from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class PollsReset extends Command {

    constructor(client: Client) {
        super(client, ["polls_reset", "reset_polls"], false, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {

            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            stat.polls = new Array<Poll>();

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.names[0]}]: All of the polls are reset.`);
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new PollsReset(client); }