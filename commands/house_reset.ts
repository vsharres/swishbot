import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import logger from '../tools/logger';
import { Command } from './command';
import { Client, Guild, Message } from 'discord.js';

export class HouseReset extends Command {

    guild: Guild;

    constructor(client: Client) {
        super(client, ["house_reset", "reset_house"], false, false, true);
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat)
                return;

            const saved_members = stat.listening_members;

            saved_members.forEach(async saved => {
                const guild_member = await this.guild.members.fetch(saved.member);

                guild_member.roles.remove(Configs.role_slytherin);
                guild_member.roles.add(saved.house);
            })

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new HouseReset(client) };