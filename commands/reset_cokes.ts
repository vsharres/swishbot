import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printcokes } from '../tools/print_cokes';
import { Client, TextChannel, SlashCommandBuilder, CommandInteraction } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';

export class CokesReset extends Command {

    cokes_channel: TextChannel;

    constructor(client: Client) {
        super(client, "cokes_reset");

        this.cokes_channel = client.channels.cache.get(Configs.channel_cokes) as TextChannel;
    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            stat.cokes = { megan_katie: 0, tiff_katie: 0, tiff_megan: 0 };

            printcokes(this.cokes_channel, stat.cokes, true);

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            logger.log('info', `[${this.name}]: Disney Coke tally reset.`);
            return await interaction.reply({ content: `Disney Coke tally reset.`, ephemeral: true });

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

export const JsonData = new SlashCommandBuilder()
    .setName("cokes_reset")
    .setDescription('Resets the cokes tally.')
    .toJSON();

export default (client: Client) => { return new CokesReset(client) };