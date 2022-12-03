import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, CommandInteraction, Guild, GuildMember, Role, SlashCommandBuilder, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from '../bot-types';

export class Lightning extends Command {

    guild: Guild;

    constructor(client: Client) {
        super(client, "questions");

        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async execute(interaction: CommandInteraction) {

        Stat.findById(Configs.stats_id).then(async stat => {

            if (!stat) {
                logger.log('error', `[${this.name}]: Error getting the stat, check the stat id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            let reply = '';
            if (stat.lightnings.length > 0) {

                reply = 'These are the lightning bolts for this recording:\n\n';

                const number_batches = Math.floor(stat.lightnings.length / 10) + 1;

                for (let index = 0; index < number_batches; index++) {
                    let end = 10 * (index + 1);
                    if (index === number_batches - 1) {
                        end = stat.lightnings.length;
                    }

                    for (let bolt = 10 * index; bolt < end; bolt++) {

                        const member = this.guild.members.cache.get(stat.lightnings[bolt].member) as GuildMember;

                        let house: Role | undefined;
                        house = member.roles.cache.find(role => role.id === Configs.role_gryffindor ||
                            role.id === Configs.role_slytherin ||
                            role.id === Configs.role_hufflepuff ||
                            role.id === Configs.role_ravenclaw);

                        reply += `${member.user.toString()}${house ? " from " + house.toString() : ''} asks: ${stat.lightnings[bolt].question}\n`;


                    }

                    interaction.channel?.send(reply);
                    reply = '';
                }

                logger.log('info', `[${this.name}]: ${stat.lightnings.length} were successfully printed.`);
            }
            else {
                return await interaction.reply({ content: `There are no lightning bolts yet`, ephemeral: true });
            }

            return await interaction.reply({ content: `⚡`, ephemeral: true });

        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));

    }
};

const JsonData = new SlashCommandBuilder()
    .setName("questions")
    .setDescription('Pulls the ⚡ questions.')
    .toJSON();

export { JsonData }

export default (client: Client) => { return new Lightning(client); }

