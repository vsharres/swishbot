import { Client, GuildMember } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import { Configs } from '../config/configs';

export class Patreon extends Handler {

    constructor(client: Client) {
        super(client, 'patreon', false, false, false, false, true);
    }

    async OnMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {

        //Ignore for admins
        if (newMember.roles.cache.has(Configs.role_prefect) || newMember.roles.cache.has(Configs.role_admin)){
            return;
        }

        if (newMember.roles.cache.has(Configs.role_phoenix_emoji)) {
            const is_dragon_and_up = newMember.roles.cache.has(Configs.role_dragon) || newMember.roles.cache.has(Configs.role_phoenix)

            if (!is_dragon_and_up) {
                newMember.roles.remove(Configs.role_phoenix_emoji);
                logger.log('info', `[${this.name}]: ${newMember.displayName} dragon role was removed from patron.`);
            }

        }
        
        const is_patron = newMember.roles.cache.has(Configs.role_patron);
        const is_hippogriff_and_up = newMember.roles.cache.has(Configs.role_phoenix) || newMember.roles.cache.has(Configs.role_dragon) || newMember.roles.cache.has(Configs.role_hippogriff);

        if ((!is_patron || !is_hippogriff_and_up) && newMember.roles.cache.has(Configs.role_ageline)) {
            newMember.roles.remove(Configs.role_ageline);
            logger.log('info', `[${this.name}]: ${newMember.displayName} age line role removed as the user no longer has access.`);
        }

    }

};

module.exports = (client: Client) => {
    return new Patreon(client);
}