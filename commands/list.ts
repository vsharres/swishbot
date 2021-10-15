import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message, Guild, GuildMember } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class List extends Command {

    constructor(client: Client) {
        super(client, ["🙅‍♀️", 'megan_list'], true, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            const meg = await message.client.users.fetch('663373766537117716', true);

            let content = `${meg.toString()}'s List of Undesirables:\n\n`;

            let new_item: string;
            if (arg.length > 0) {

                new_item = arg.join(' ');
                content += new_item;
                stat.list.push(new_item);

            }

            stat.list.forEach((item) => content += `${item} - 🙅‍♀️\n`);

            message.channel.send(content);

            stat.save();

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

    }
};

export default (client: Client) => { return new List(client); }