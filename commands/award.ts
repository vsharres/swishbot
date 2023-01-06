import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, CommandInteraction, CommandInteractionOptionResolver, Role, SlashCommandBuilder, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';
import { printcups } from '../tools/print_cups';

const JsonData = new SlashCommandBuilder()
    .setName("award_cup")
    .setDescription('Awards cup to house')
    .addStringOption(option =>
        option.setName('house')
            .setDescription('House to award the cup to.')
            .setRequired(true)
            .addChoices(
                { name: 'Gryffindor 🦁', value: Configs.role_gryffindor },
                { name: 'Slytherin 🐍', value: Configs.role_slytherin },
                { name: 'Ravenclaw 🦅', value: Configs.role_ravenclaw },
                { name: 'Hufflepuff 🦡', value: Configs.role_hufflepuff })
    ).toJSON();

export class Award extends Command {

    trophy_channel: TextChannel;
    recording_channel: TextChannel;

    constructor(client: Client) {
        super(client, "award_cup");
        this.trophy_channel = client?.channels.cache.get(Configs.channel_trophy_room) as TextChannel;
        this.recording_channel = client?.channels.cache.get(Configs.channel_recording) as TextChannel;
    }

    async execute(interaction: CommandInteraction) {

        const house_id = (interaction.options as CommandInteractionOptionResolver).getString('house') as string;

        Stat.findById(Configs.stats_id).then(async (stat) => {

            if (!stat) {
                logger.log('error', `[${this.name}]: Error to get the stats, check the id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            switch (house_id) {
                case Configs.role_gryffindor:
                    stat.house_cups.gryffindor++;
                    break;
                case Configs.role_slytherin:
                    stat.house_cups.slytherin++;
                    break;
                case Configs.role_ravenclaw:
                    stat.house_cups.ravenclaw++;
                    break;
                case Configs.role_hufflepuff:
                    stat.house_cups.hufflepuff++;
                    break;
                default:
                    logger.log('error', `[${this.name}]: Incorrect usage.`);
                    return;
            }

            printcups(this.trophy_channel, stat.house_cups, true);

            stat
                .save()
                .catch(err => logger.log('error', err));

            this.recording_channel
                .send(`House cup awarded to <@&${house_id}>!`)
                .then(() => logger.log('info', `[${this.name}]: House cup awarded to <@&${house_id}>!`))
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));

        return await interaction.reply({ content: `House cup awarded to <@&${house_id}>!`, ephemeral: true });

    }
};


export { JsonData }

export default (client: Client) => { return new Award(client); }