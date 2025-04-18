import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';

const JsonData = new SlashCommandBuilder()
    .setName("undesirables")
    .setDescription(`Lists Megan's undesirables.`)
    .addStringOption(option =>
        option.setName('undesirable')
            .setDescription('Item do add to the undesirables list.'))
    .toJSON();

export class ListUndesirables extends Command {


    constructor(client: Client) {
        super(client, "undesirables");

    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {

            const undesirable = (interaction.options as CommandInteractionOptionResolver).getString('undesirable') ?? null;

            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            if (undesirable) {
                stat.list.push(undesirable)
            }

            let content = `Megan's List of Undesirables:\n\n`;

            stat.list.forEach((item) => content += `${item} - 🙅‍♀️\n`);

            await (interaction.channel as TextChannel).send(content);

            stat.save()
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            return await interaction.reply({ content: `List of undesirables.`, ephemeral: false })

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));

    }
};

export { JsonData }

export default (client: Client) => { return new ListUndesirables(client); }