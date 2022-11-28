import { Client, CommandInteraction, Guild, SlashCommandBuilder } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';
import { Configs } from '../config/configs';

export class Tergeo extends Command {
    guild: Guild;

    constructor(client: Client) {
        super(client, 'tergeo');

        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async execute(interaction: CommandInteraction) {

        const Members = await this.guild.members.fetch();

        Members.forEach((member) => {

            if (!member.roles.cache.has(Configs.role_prefect) && !member.roles.cache.has(Configs.role_admin)) {

                if (member.roles.cache.has(Configs.role_phoenix_emoji)) {
                    const is_phoenix_or_up = member.roles.cache.has(Configs.role_phoenix) || member.roles.cache.has(Configs.role_unicorn) || member.roles.cache.has(Configs.role_hippogriff);

                    if (!is_phoenix_or_up) {
                        member.roles.remove(Configs.role_phoenix_emoji);
                        logger.log('info', `[${this.name}]: ${member.displayName} phoenix role was removed`);
                    }

                }

                const is_patron = member.roles.cache.has(Configs.role_patron);
                const is_dragon_or_up = member.roles.cache.has(Configs.role_phoenix) || member.roles.cache.has(Configs.role_unicorn) || member.roles.cache.has(Configs.role_hippogriff) || member.roles.cache.has(Configs.role_dragon);

                if ((!is_patron || !is_dragon_or_up) && member.roles.cache.has(Configs.role_ageline)) {
                    member.roles.remove(Configs.role_ageline);
                    logger.log('info', `[${this.name}]: ${member.displayName} age line role removed as the user no longer has access.`);
                }
            }

        });

        return await interaction.reply({ content: `Members were successfully pruned.`, ephemeral: true })
    }

};

export const JsonData = new SlashCommandBuilder()
    .setName("tergeo")
    .setDescription('Prune members from the server.')
    .toJSON();

export default (client: Client) => { return new Tergeo(client) };