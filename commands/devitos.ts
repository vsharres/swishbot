import { Configs } from '../config/configs';
import { Units, Unit } from '../config/units';
import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js'
import logger from '../tools/logger';
import { Command } from '../bot-types';

export class Devitos extends Command {
    constructor(client: Client) {
        super(client, "devitos");

    }

    async execute(interaction: CommandInteraction) {

        const amount = (interaction.options as any).getNumber('amount') as number;
        let unit = (interaction.options as any).getString('unit') as string;
        unit = unit.toLowerCase();

        if (!Units.has(unit)) {
            logger.log('error', `[${this.name}]: Unit provided is not a valid one, please use a standard unit type.`);
            return await interaction.reply('Unit provided is not a valid one, please use a standard unit type.');
        }

        const selected_unit = Units.get(unit) as Unit;
        const devitos = (amount * selected_unit.multiplier / selected_unit.divisor);
        const devitos_string = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(devitos);
        const string_amount = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(amount);
        const message_to_send = `${string_amount} ${unit} are ${devitos_string} ${Configs.command_prefix}!`;

        return await interaction.reply(message_to_send);
    }
};

export const JsonData = new SlashCommandBuilder()
    .setName("devitos")
    .setDescription('Converts a measure to devitos.')
    .addNumberOption(option =>
        option.setName('amount')
            .setDescription('Amount to be converted')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('unit')
            .setDescription('Unit to convert from')
            .setRequired(true))
    .toJSON();

export default (client: Client) => { return new Devitos(client); }

module.exports = (client: Client) => {
    return new Devitos(client);
}
