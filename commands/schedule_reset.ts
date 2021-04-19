import Stat, { Recording } from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class ScheduleReset extends Command {

    constructor(client: Client) {
        super(client, ["schedule_reset", "reset_schedule"], false, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {

            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            stat.recordings = new Map<string, Recording>();

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.names[0]}]: The scheduler was reset.`);
                    message.channel.send(`The Scheduler was reset.`);
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new ScheduleReset(client); }