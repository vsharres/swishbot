import Stat, { AuthorsArray, Lightning, Listener } from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';
import { printPoints } from '../tools/print_points';
import { printcokes } from '../tools/print_cokes';

const JsonData = new SlashCommandBuilder()
    .setName("reset")
    .setDescription('Resets properties in the database.')
    .addBooleanOption(option =>
        option.setName('points')
            .setDescription('Set it to reset the house points.')
            .setRequired(false)
    )
    .addBooleanOption(option =>
        option.setName('likes')
            .setDescription('Set it to reset the likes counter.')
            .setRequired(false)
    )
    .addBooleanOption(option =>
        option.setName('lightning')
            .setDescription('Set it to reset the lightning bolts')
            .setRequired(false)
    )
    .addBooleanOption(option =>
        option.setName('listening_members')
            .setDescription('Set it to reset the listening_members array.')
            .setRequired(false)
    )
    .addBooleanOption(option =>
        option.setName('cokes')
            .setDescription('Set it to reset the number of cokes.')
            .setRequired(false)
    )
    .toJSON();

export class Reset extends Command {
    hourglass_channel: TextChannel;
    cokes_channel: TextChannel;

    constructor(client: Client) {
        super(client, "reset");

        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
        this.cokes_channel = client.channels.cache.get(Configs.channel_cokes) as TextChannel;
    }

    async execute(interaction: CommandInteraction) {

        const reset_likes = (interaction.options as CommandInteractionOptionResolver).getBoolean('likes') as boolean ?? false;
        const reset_lightning = (interaction.options as CommandInteractionOptionResolver).getBoolean('lightning') as boolean ?? false;
        const reset_points = (interaction.options as CommandInteractionOptionResolver).getBoolean('points') as boolean ?? false;
        const reset_listening_members = (interaction.options as CommandInteractionOptionResolver).getBoolean('listening_members') as boolean ?? false;
        const reset_cokes = (interaction.options as CommandInteractionOptionResolver).getBoolean('cokes') as boolean ?? false;

        if (!reset_likes && !reset_lightning && !reset_points && !reset_listening_members && !reset_cokes)
            return await interaction.reply({ content: `No options provided, no properties were reset.`, ephemeral: true });

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            if (reset_likes) stat.likes = new Map<string, AuthorsArray>();
            if (reset_lightning) stat.lightnings = new Array<Lightning>();

            if (reset_points) {
                stat.points = { gryffindor: 0, ravenclaw: 0, slytherin: 0, hufflepuff: 0 };
                printPoints(this.hourglass_channel, stat.points, true);
            }

            if (reset_listening_members) stat.listening_members = new Array<Listener>();

            if (reset_cokes) {
                stat.cokes = { megan_katie: 0, tiff_katie: 0, tiff_megan: 0 };
                printcokes(this.cokes_channel, stat.cokes, true);
            }

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            logger.log('info', `[${this.name}]: Points, Likes, zaps are all reset.`);
            return await interaction.reply({ content: `${reset_points ? 'Points, ' : ''}${reset_likes ? 'Likes, ' : ''}${reset_lightning ? 'Lightning Bolts, ' : ''}${reset_listening_members ? 'Listening Members, ' : ''}${reset_cokes ? 'Cokes' : ''} are reset.`, ephemeral: false });

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

export { JsonData }

export default (client: Client) => { return new Reset(client); }