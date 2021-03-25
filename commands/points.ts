import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import { printPoints } from '../tools/print_points';

export class Points extends Command {

    constructor(client: Client) {
        super(client, ["points"]);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            const points = stat.points;
            printPoints(message.channel as TextChannel, points);

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

    }
};

export default (client: Client) => { return new Points(client); }