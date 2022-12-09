import Stat, { AuthorsArray, Lightning, Listener } from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';

export class Reset extends Command {

    constructor(client: Client) {
        super(client, "reset");

    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {
            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            //stat.points = {gryffindor: 0, ravenclaw:0, slytherin:0, hufflepuff:0} ;
            stat.likes = new Map<string, AuthorsArray>();
            stat.lightnings = new Array<Lightning>();
            stat.listening_members = new Array<Listener>();
            //stat.polls = new Array<Poll>();

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

            logger.log('info', `[${this.name}]: Points, Likes, zaps are all reset.`);
            return await interaction.reply({ content: `Points, Likes, zaps are all reset.`, ephemeral: false });

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};

const JsonData = new SlashCommandBuilder()
    .setName("reset")
    .setDescription('Resets the likes and lightning bolt questions.')
    .toJSON();

export { JsonData }

export default (client: Client) => { return new Reset(client); }