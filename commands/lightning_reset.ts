import Stat, { Lightning } from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';

export class LightningReset extends Command {

    constructor(client: Client) {
        super(client, "lightning_reset");
    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {

            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            stat.lightnings = new Array<Lightning>();

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            logger.log('info', `[${this.name}]: All of the lightning bolts are reset.`);

            return await interaction.reply(`All of the lightning bolts are reset.`);

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

const JsonData = new SlashCommandBuilder()
    .setName("lightning_reset")
    .setDescription('Resets the ⚡ questions for this recording.')
    .toJSON();

export { JsonData }

export default (client: Client) => { return new LightningReset(client); }