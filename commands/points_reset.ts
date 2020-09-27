import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { Message, TextChannel } from 'discord.js';
import { Logger } from 'winston';
import { Command } from './command';

export class PointsReset extends Command {

    constructor() {
        super(["points_reset", "reset_points"], '', 10, '', false, true);
    }

    async execute(message: Message, arg: string[], logger: Logger) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat)
                return;

            stat.points = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };

            const guild = message.guild;
            if (!guild) return;
            const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);

            printPoints(hourglass_channel, stat.points, logger, true);

            stat
                .save()
                .then(() => {
                    logger.log('info', `A new year has begun! All house points are reset.`);
                })
                .catch(err => logger.log('error', err));

        })
            .catch(err => logger.log('error', err));
    }
};

export default new PointsReset();