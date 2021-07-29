import { Client, GuildMember } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import { Configs } from '../config/configs';

export class Patreon extends Handler {

    constructor(client: Client) {
        super(client, 'patreon', false, false, false, false, true);
    }

    async OnMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {

        if (newMember.roles.cache.has(Configs.role_phoenix_emoji)) {
            const is_phoenix = newMember.roles.cache.has(Configs.role_phoenix) || newMember.roles.cache.has(Configs.role_phoenix_plus);

            if (!is_phoenix) {
                newMember.roles.remove(Configs.role_phoenix_emoji);
                logger.log('info', `[${this.name}]: ${newMember.displayName} phoenix role was removed from patreon.`);
            }

        }

        if (!newMember.roles.cache.has(Configs.role_patron) && newMember.roles.cache.has(Configs.role_ageline)) {
            newMember.roles.remove(Configs.role_ageline);
            logger.log('info', `[${this.name}]: ${newMember.displayName} age line role removed as the user is no longer a patron.`);
        }

    }

};

module.exports = (client: Client) => {
    return new Patreon(client);
}