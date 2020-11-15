import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import { printcups } from '../tools/print_cups';

export class Cups extends Command {

    constructor() {
        super(["cups"], '', 10, '');
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then((stat) => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            const cups = stat.house_cups;

            printcups(<TextChannel>message.channel, cups, logger);

            logger.log('log', `[${this.names[0]}]: Total number of cups: ${cups}`);


        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default new Cups();