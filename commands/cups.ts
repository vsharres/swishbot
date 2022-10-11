import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import { printcups } from '../tools/print_cups';

export class Cups extends Command {

    trophy_channel: TextChannel;

    constructor(client: Client) {
        super(client, ["cups", "cup"], false, false, true);
        this.trophy_channel = client.channels.cache.get(Configs.channel_trophy_room) as TextChannel;
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then((stat) => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            printcups(message.channel as TextChannel, stat.house_cups);

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Cups(client); }