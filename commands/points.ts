import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import { printPoints } from '../tools/print_points';

export class Points extends Command {

    constructor() {
        super(["points"], '', 10, '');
    }

    async execute(message: Message, arg: string[]) {
        try {
            const guild = await message.guild?.fetch();
            if (guild) {
                Stat.findById(Configs.stats_id).then(stat => {
                    if (!stat) {
                        return logger.log('error', `[${this.names[0]}]:Error getting the stat, check the stat id`);
                    }

                    const points = stat.points;

                    return printPoints(<TextChannel>message.channel, points);

                })
                    .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
            }



        }
        catch (err) {
            return;
        }

    }
};

export default new Points();