import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, CommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';
import { printcups } from '../tools/print_cups';

export class Cups extends Command {

    constructor(client: Client) {
        super(client, "cups");

    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async (stat) => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            printcups(interaction.channel as TextChannel, stat.house_cups);

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));

        await interaction.reply({ content: `House cups printed`, ephemeral: true });
    }
};

const JsonData = new SlashCommandBuilder()
    .setName("cups")
    .setDescription('Prints the cups tally')
    .toJSON();

export default (client: Client) => { return new Cups(client); }

export { JsonData }