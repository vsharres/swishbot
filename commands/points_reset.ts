import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { Client, TextChannel, SlashCommandBuilder, CommandInteraction } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';

export class PointsReset extends Command {

    hourglass_channel: TextChannel;

    constructor(client: Client) {
        super(client, "points_reset");

        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;

    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            stat.points = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };

            printPoints(this.hourglass_channel, stat.points, true);

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: All house points are reset.`);
                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            return await interaction.reply('All house points are reset.');

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

const JsonData = new SlashCommandBuilder()
    .setName("points_reset")
    .setDescription('Resets the points of each house')
    .toJSON();

export { JsonData }

export default (client: Client) => { return new PointsReset(client); }