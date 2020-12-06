import moment from 'moment-timezone';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class Recording extends Command {

    constructor() {
        super(["recording"], true, false, true);
    }

    async execute(message: Message, args: string[]) {

        const date_string = moment.tz(args.join(' '), "DD MMM YYYY hh:mm aa", 'America/New_York');
        const zoned = date_string.format();

        if (!date_string.isValid()) {
            return;
        }

        Stat.findById(Configs.stats_id).then(stat => {

            if (!stat) return;

            stat.recording_date = new Date(zoned);

            stat
                .save()
                .then(() => {
                    message.reply(`New recording set to ${zoned.toString()}`);
                    logger.log('info', `[${this.names[0]}]: New recording set to ${zoned.toString()}`);
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default new Recording();
