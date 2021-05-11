import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import logger from '../tools/logger';
import { Command } from './command';
import { Client, Guild, GuildMember, Message } from 'discord.js';

export class HouseReset extends Command {

    guild: Guild;

    constructor(client: Client) {
        super(client, ["house_reset", "reset_house"], false, false, true);
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat)
                return;

            const saved_members = stat.listening_members;
            const guild_members = await this.guild.members.fetch();

            saved_members.forEach(saved => {
                const guild_member = guild_members.get(saved.member) as GuildMember;
                guild_member.roles.remove(Configs.role_slytherin);
                guild_member.roles.add(saved.house);
            })

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new HouseReset(client) };