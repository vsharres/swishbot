import Stat, { Listener } from '../models/Stat';
import { Configs } from '../config/configs';
import logger from '../tools/logger';
import { Command } from '../bot-types';
import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export class ListenersReset extends Command {

    constructor(client: Client) {
        super(client, "listeners_reset");

    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            stat.listening_members = new Array<Listener>();

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            logger.log('info', `[${this.name}]:The map of likes has been reset.`);
            return await interaction.reply({ content: `The map of likes has been reset.`, ephemeral: true })

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

export const JsonData = new SlashCommandBuilder()
    .setName("listeners_reset")
    .setDescription('Resets the listener array.')
    .toJSON();


module.exports = (client: Client) => {
    return new ListenersReset(client);
}