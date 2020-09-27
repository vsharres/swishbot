import moment from 'moment-timezone';
import Stat, { Lightning } from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, TextChannel } from 'discord.js';
import { Logger } from 'winston';
import { Command } from './command';
import { printPoints } from '../tools/print_points';

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

            const guild = message.guild;
            if (!guild) return;
            const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);

            stat.recording_date = new Date(zoned);
            stat.lightnings = new Array<Lightning>();
            stat.points = {
                gryffindor: 0,
                slytherin: 0,
                ravenclaw: 0,
                hufflepuff: 0
            };

            printPoints(hourglass_channel, stat.points, logger, true);

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
