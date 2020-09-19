import moment from 'moment-timezone';
import Stat, { Lightning } from '../models/Stat';
import { Configs } from '../config/configs';
import { Message } from 'discord.js';
import { Logger } from 'winston';
import { Command } from './command';

export class Recording extends Command {

    constructor() {
        super(["recording"], 'Start the recording, prompting the chat for volunteers to be the head pupil', 30, '<date> <time>', true, true);
    }

    async execute(message: Message, args: string[], logger: Logger) {

        const date_string = moment.tz(args.join(' '), "DD MMM YYYY hh:mm aa", 'America/New_York');
        const zoned = date_string.format();

        if (!date_string.isValid()) {
            return;
        }

        Stat.findById(Configs.stats_id).then(stat => {

            if (!stat) return;

            stat.recording_date = new Date(zoned);
            stat.lightnings = new Array<Lightning>();
            stat
                .save()
                .then(() => {
                    message.reply(`New recording set to ${date_string.toString()}`);
                    logger.log('info', `New recording set to ${date_string.toString()}`);
                })
                .catch(err => logger.log('error', err));
        })
            .catch(err => logger.log('error', err));
    }
};

export default new Recording();
