import Stat, { Poll } from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, CommandInteraction, Message, SlashCommandBuilder } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';

export class PollsReset extends Command {

    constructor(client: Client) {
        super(client, "polls_reset");
    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {

            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            stat.polls = new Array<Poll>();

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            logger.log('info', `[${this.name}]: All of the polls are reset.`);
            return await interaction.reply({ content: `All of the poll was reset.`, ephemeral: true });

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

export const JsonData = new SlashCommandBuilder()
    .setName("polls_reset")
    .setDescription('Resets the polls counter.')
    .toJSON();

module.exports = (client: Client) => {
    return new PollsReset(client);
}