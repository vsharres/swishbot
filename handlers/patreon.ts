import { Client, GuildMember } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import { Configs } from '../config/configs';

export class Patreon extends Handler {

    constructor(client: Client) {
        super(client, 'patreon', false, false, false, false, true);
    }

    async OnMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {

        const roles = await newMember.guild.roles.fetch();

        //Ignore for admins
        if (roles.has(Configs.role_prefect) || roles.has(Configs.role_admin)){
            return;
        }

        if (roles.has(Configs.role_phoenix_emoji)) {
            const is_phoenix_and_up = roles.has(Configs.role_unicorn) || roles.has(Configs.role_phoenix);

            if (!is_phoenix_and_up) {
                newMember.roles.remove(Configs.role_phoenix_emoji);
                logger.log('info', `[${this.name}]: ${newMember.displayName} phoenix role was removed from patron.`);
            }

        }
        
        const is_patron = roles.has(Configs.role_patron);
        const is_hippogriff_and_up = roles.has(Configs.role_unicorn) || roles.has(Configs.role_phoenix) || 
        roles.has(Configs.role_dragon) || roles.has(Configs.role_hippogriff);

        if ((!is_patron || !is_hippogriff_and_up) && roles.has(Configs.role_ageline)) {
            newMember.roles.remove(Configs.role_ageline);
            logger.log('info', `[${this.name}]: ${newMember.displayName} age line role removed as the user no longer has access.`);
        }

    }

};

module.exports = (client: Client) => {
    return new Patreon(client);
}