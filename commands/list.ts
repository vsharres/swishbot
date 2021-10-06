import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message, Guild, GuildMember } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class List extends Command {

    guild: Guild;

    constructor(client: Client) {
        super(client, ["list"], true, false, true);

        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            const meg = this.guild.members.cache.get('663373766537117716') as GuildMember;

            let content = `${meg.toString()} List of Undesirables:\n\n`;

            let new_item;
            if (arg.length > 0) {
                new_item = arg.shift();
                if (new_item) {
                    content += new_item;
                    stat.list.push(new_item);
                }

            }

            stat.list.forEach((item) => content += `${item} - 🙅‍♀️\n`);

            message.channel.send(content);

            stat.save();

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

    }
};

export default (client: Client) => { return new List(client); }