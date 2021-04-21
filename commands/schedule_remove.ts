import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class ScheduleRemove extends Command {

    constructor(client: Client) {
        super(client, ["schedule_remove", 'remove_schedule'], true, false, true);

    }

    async execute(message: Message, arg: string[]) {

        if (!arg[0].startsWith('"')) {
            //add error message
            return;
        }

        let description_end = false;
        let description = '';

        while (!description_end) {
            let word = arg.shift();
            description += `${word} `;

            if (word?.endsWith('"')) {
                description_end = true;
            }
        }

        description = description.replace('"', '');
        description = description.replace('"', '');
        description = description.trim();

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) return;

            if (!stat.recordings.delete(description)) {
                logger.log('error', `[${this.names[0]}]: No schedule found with the description: ${description}`);
                message.reply(`No schedule found with the description: ${description}`);
                return;
            }

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.names[0]}]: ${description} removed from the schedule`);
                    message.channel.send(`${description} removed from the schedule`);

                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new ScheduleRemove(client) };