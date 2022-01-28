import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class ListUndesirables extends Command {

    constructor(client: Client) {
        super(client, ["<:meg:796919766408495104>", 'megan_desirables'], true, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            const meg = await message.client.users.fetch('663373766537117716');

            let content = `${meg.toString()}'s List of desirables:\n\n`;

            let new_item: string;
            if (arg.length > 0) {

                new_item = arg.join(' ');
                stat.desirables.push(new_item);

            }

            stat.desirables.forEach((item) => content += `${item} - <:meg:796919766408495104>\n`);

            message.channel.send(content);

            stat.save();

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

    }
};

export default (client: Client) => { return new ListUndesirables(client); }