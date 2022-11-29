import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import logger from '../tools/logger';
import { Command } from '../bot-types';
import { Client, CommandInteraction, Guild, GuildMember, SlashCommandBuilder } from 'discord.js';

export class HouseReset extends Command {

    guild: Guild;

    constructor(client: Client) {
        super(client, "house_reset");
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error to get the stats, check the id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            const saved_members = stat.listening_members;
            const guild_members = await this.guild.members.fetch();

            saved_members.forEach(saved => {
                const guild_member = guild_members.get(saved.member) as GuildMember;
                guild_member.roles.remove(Configs.role_slytherin);
                guild_member.roles.add(saved.house);
            })

            return await interaction.reply({ content: `House roles reset.`, ephemeral: true });

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

export const JsonData = new SlashCommandBuilder()
    .setName("house_reset")
    .setDescription('Resets the house of all members in the recording channel')
    .toJSON();

module.exports = (client: Client) => {
    return new HouseReset(client);
}