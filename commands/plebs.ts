import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, TextChannel, SlashCommandBuilder, CommandInteraction } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';

export class Plebs extends Command {

    recording_channel: TextChannel;

    constructor(client: Client) {
        super(client, "plebs");
        this.recording_channel = client.channels.cache.get(Configs.channel_recording) as TextChannel;
    }

    async execute(interaction: CommandInteraction) {

        const channel = (interaction.options as any).getChannel('channel') as TextChannel;
        const message = (interaction.options as any).getString('message') as string;

        Stat.findById(Configs.stats_id).then(async (stat) => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            channel
                .send(message)
                .then(() => logger.log('info', `${message}`))
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            return await interaction.reply({ content: `Message to the plebs sent in the ${channel.toString()} channel.`, ephemeral: true });

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

export const JsonData = new SlashCommandBuilder()
    .setName('plebs')
    .setDescription('Send a message to the plebs')
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('Channel to send message to')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('message')
            .setDescription('Message to send')
            .setRequired(true)
    )
    .toJSON();

export default (client: Client) => { return new Plebs(client); }