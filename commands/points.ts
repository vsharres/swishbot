import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import { printPoints } from '../tools/print_points';

export class Points extends Command {

    constructor() {
        super(["points"]);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]:Error getting the stat, check the stat id`);
            }

            const points = stat.points;
            printPoints(<TextChannel>message.channel, points);

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

    }
};

export default new Points();