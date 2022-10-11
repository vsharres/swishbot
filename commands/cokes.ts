import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import { printcokes } from '../tools/print_cokes';

export class Cokes extends Command {

    constructor(client: Client) {
        super(client, ["cokes", `${Configs.emoji_coke}`], false, false, true);
        
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            printcokes(message.channel as TextChannel, stat.cokes);

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

    }
};

export default (client: Client) => { return new Cokes(client); }