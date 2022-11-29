import Stat, { AuthorsArray } from '../models/Stat';
import { Configs } from '../config/configs';
import logger from '../tools/logger';
import { Command } from '../bot-types';
import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export class LikesReset extends Command {

    constructor(client: Client) {
        super(client, "likes_reset");

    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            stat.likes = new Map<string, AuthorsArray>();

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            return await interaction.reply({ content: `The counter of likes was reset.`, ephemeral: true })

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

export const JsonData = new SlashCommandBuilder()
    .setName("likes_reset")
    .setDescription('Resets the likes for all messages.')
    .toJSON();

module.exports = (client: Client) => {
    return new LikesReset(client);
}