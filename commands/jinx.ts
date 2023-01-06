import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { TextChannel, Client, Guild, SlashCommandBuilder, CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import { printcokes } from '../tools/print_cokes';
import logger from '../tools/logger';
import { Command } from '../bot-types';

const JsonData = new SlashCommandBuilder()
    .setName("jinx")
    .setDescription('Jinx! You owe me a coke!')
    .addStringOption(option =>
        option.setName('owes')
            .setDescription('Who owes')
            .setRequired(true)
            .addChoices(
                { name: "Megan", value: "0" },
                { name: "Katie", value: "1" },
                { name: "Tiff", value: "3" }))
    .addStringOption(option =>
        option.setName('owed')
            .setDescription('To whom they owe')
            .setRequired(true)
            .addChoices(
                { name: "Megan", value: "0" },
                { name: "Katie", value: "1" },
                { name: "Tiff", value: "3" })
    )
    .toJSON();

export class Jinx extends Command {

    cokes_channel: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, "jinx");

        this.cokes_channel = client.channels.cache.get(Configs.channel_cokes) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    //TODO: finish this function
    async execute(interaction: CommandInteraction) {

        let owes_id = (interaction.options as CommandInteractionOptionResolver).getString('owes') as string;
        let owed_id = (interaction.options as CommandInteractionOptionResolver).getString('owed') as string;

        if (owed_id === owes_id) {
            logger.log('error', `[${this.name}]: They can't owe a coke to themselves.`);
            return await interaction.reply({ content: `They can't owe a coke to themselves.`, ephemeral: true });
        }

        Stat.findById(Configs.stats_id).then(async stat => {

            if (!stat) {
                logger.log('error', `[${this.name}]: Error to get the stats, check the id`);
                return await interaction.reply({ content: `Error to get the stats, check the id`, ephemeral: true });
            }

            let cokes = stat.cokes;
            switch (owes_id) {
                case "0":
                    {
                        switch (owed_id) {
                            case "1":
                                ++cokes.megan_katie;
                                owed_id = Configs.id_katie;
                                break;
                            case "2":
                                --cokes.tiff_megan;
                                owed_id = Configs.id_tiff;
                                break;

                        }
                        owes_id = Configs.id_megan;
                    }
                    break;
                case "1":
                    {
                        switch (owed_id) {
                            case "0":
                                --cokes.megan_katie;
                                owed_id = Configs.id_megan;
                                break;
                            case "2":
                                --cokes.tiff_katie;
                                owed_id = Configs.id_tiff;
                                break;

                        }
                        owes_id = Configs.id_katie;
                    }
                    break;
                case "2":
                    {
                        switch (owed_id) {
                            case "0":
                                ++cokes.tiff_megan;
                                owed_id = Configs.id_megan;
                                break;
                            case "1":
                                ++cokes.tiff_katie;
                                owed_id = Configs.id_katie;
                                break;

                        }
                        owes_id = Configs.id_tiff;
                    }
                    break;
            }

            stat.cokes.megan_katie = cokes.megan_katie;
            stat.cokes.tiff_katie = cokes.tiff_katie;
            stat.cokes.tiff_megan = cokes.tiff_megan;

            const owed_member = this.guild.members.cache.get(owed_id);
            const owes_member = this.guild.members.cache.get(owes_id);
            const messageToSent = `${owes_member?.toString()} owes a ${Configs.emoji_coke} to ${owed_member?.toString()}!https://tenor.com/view/%D0%BC%D0%B0%D0%BB%D1%8B%D1%88%D0%BF%D1%8C%D0%B5%D1%82-drink-smile-sour-gif-16234538`;

            stat
                .save()
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));
            logger.log('info', `[${this.name}]: ${messageToSent}`);

            printcokes(this.cokes_channel, stat.cokes, true);
            interaction.channel?.send(messageToSent)
            return await interaction.reply({ content: messageToSent, ephemeral: true });
        })
            .catch(err => logger.log('error', `[${this.name}]: ${err}`));
    }
};



export { JsonData }

export default (client: Client) => { return new Jinx(client); }