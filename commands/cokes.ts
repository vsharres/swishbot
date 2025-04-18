import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, CommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';
import { printcokes } from '../tools/print_cokes';

const JsonData = new SlashCommandBuilder()
    .setName("cokes")
    .setDescription('Prints the coke tally').toJSON();

export class Cokes extends Command {

    constructor(client: Client) {
        super(client, "cokes");
    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            printcokes(interaction.channel as TextChannel, stat.cokes);

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));

        return await interaction.reply({ content: `Cokes tally`, ephemeral: false });

    }
};


export default (client: Client) => { return new Cokes(client); }

export { JsonData }