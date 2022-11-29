import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, TextChannel, SlashCommandBuilder, CommandInteraction } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';
import { printPoints } from '../tools/print_points';

export class Points extends Command {

    constructor(client: Client) {
        super(client, "points");

    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            printPoints(interaction.channel as TextChannel, stat.points);

            return await interaction.reply({ content: `House points printed`, ephemeral: true })

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));

    }
};

export const JsonData = new SlashCommandBuilder()
    .setName("points")
    .setDescription('Prints the house points in the current channel.')
    .toJSON();

module.exports = (client: Client) => {
    return new Points(client);
}