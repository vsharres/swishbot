import { Client, Guild, GuildMemberManager, Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import { Configs } from '../config/configs';

export class Tergeo extends Command {

    guild: Guild;

    constructor(client: Client) {
        super(client, ['tergeo'], true);

        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
        
    }

    async execute(message: Message, arg: string[]) {

       const Members = await this.guild.members.fetch();

       Members.forEach((member) => {

        if (!member.roles.cache.has(Configs.role_prefect) && !member.roles.cache.has(Configs.role_admin)){
            
            if (member.roles.cache.has(Configs.role_phoenix_emoji)) {
                const is_phoenix_and_up = member.roles.cache.has(Configs.role_phoenix) || member.roles.cache.has(Configs.role_unicorn) || member.roles.cache.has(Configs.role_thunderbird);

                if (!is_phoenix_and_up) {
                    member.roles.remove(Configs.role_phoenix_emoji);
                    logger.log('info', `[${this.names[0]}]: ${member.displayName} phoenix role was removed`);
                }

            }
        
            const is_patron = member.roles.cache.has(Configs.role_patron);
            const is_dragon_and_up = member.roles.cache.has(Configs.role_phoenix) || member.roles.cache.has(Configs.role_unicorn) || member.roles.cache.has(Configs.role_thunderbird) || member.roles.cache.has(Configs.role_dragon);

            if ((!is_patron || !is_dragon_and_up) && member.roles.cache.has(Configs.role_ageline)) {
                member.roles.remove(Configs.role_ageline);
                logger.log('info', `[${this.names[0]}]: ${member.displayName} age line role removed as the user no longer has access.`);
            }
        }

       });
    }

};

export default (client: Client) => { return new Tergeo(client) };