import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, TextChannel, SlashCommandBuilder, CommandInteraction } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';
import { printPoints } from '../tools/print_points';

const JsonData = new SlashCommandBuilder()
    .setName("points")
    .setDescription('Prints the house points in the current channel.')
    .toJSON();


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

            return await interaction.reply({ content: 'Points', ephemeral: true })

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));

    }
};

export { JsonData }

export default (client: Client) => { return new Points(client); }