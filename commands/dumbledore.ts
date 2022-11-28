import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, TextChannel, Client, SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { printPoints } from '../tools/print_points';
import logger from '../tools/logger';
import { Command } from '../bot-types';

export class Dumbly extends Command {

    hourglass_channel: TextChannel;

    constructor(client: Client) {
        super(client, "dumbly");
        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
    }

    async execute(interaction: CommandInteraction) {

        const amount = (interaction.options as any).getNumber('amount') as number;
        const house_id = (interaction.options as any).getString('house') as string;

        Stat.findById(Configs.stats_id).then(async (stat) => {

            if (!stat) {
                logger.log('error', `[${this.name}]: Error to get the stats, check the id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            let name = "Gryffindor 🦁"
            switch (house_id) {
                case Configs.role_gryffindor:
                    stat.points.gryffindor += amount * Configs.gryffindor_points_multiplier;
                    break;
                case Configs.role_slytherin:
                    stat.points.slytherin += amount * Configs.slytherin_points_multiplier;
                    name = 'Slytherin 🐍';
                    break;
                case Configs.role_ravenclaw:
                    stat.points.ravenclaw += amount * Configs.ravenclaw_points_multiplier;
                    name = 'Ravenclaw 🦅';
                    break;
                case Configs.role_hufflepuff:
                    stat.points.hufflepuff += amount * Configs.hufflepuff_points_multiplier;
                    name = 'Hufflepuff 🦡';
                    break;
                default:
                    logger.log('error', `[${this.name}]: Error parsing the house from the arguments`);
                    return;
            }

            const messageToSent = `**${amount} points** ${amount > 0 ? 'to' : 'from'} <@&${house_id}>!!`;

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));
            logger.log('info', `[${this.name}]: ${messageToSent}`);

            printPoints(this.hourglass_channel, stat.points, true);
            interaction.channel?.send(messageToSent);
            return await interaction.reply({ content: `Points ${amount} ${amount > 0 ? 'awarded to' : 'removed from'} ${name}`, ephemeral: true });
        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

export const JsonData = new SlashCommandBuilder()
    .setName('dumbly')
    .setDescription('Awards/removes points from a house')
    .addNumberOption(option =>
        option.setName('amount')
            .setDescription('Amount of points to be awarded/removed')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('house')
            .setDescription('House to award/remove points')
            .setRequired(true)
            .addChoices(
                { name: 'Gryffindor 🦁', value: Configs.role_gryffindor },
                { name: 'Slytherin 🐍', value: Configs.role_slytherin },
                { name: 'Ravenclaw 🦅', value: Configs.role_ravenclaw },
                { name: 'Hufflepuff 🦡', value: Configs.role_hufflepuff }
            ))
    .toJSON();

export default (client: Client) => { return new Dumbly(client); }