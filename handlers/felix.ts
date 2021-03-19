import { Client, Guild, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { addPoints } from '../tools/add_points';
import { printPoints } from '../tools/print_points';

export class Felix extends Handler {

    guild: Guild;
    hourglass_channel: TextChannel;

    constructor(client: Client) {
        super(client, 'felix', true);

        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
    }

    async OnMessage(message: Message) {

        if (message.author.bot) return;
        if (message.channel.id !== Configs.channel_recording) return;

        const guild_member = await this.guild.members.fetch('663373766537117716');
        if (!guild_member) return;

        const chance = Math.random() * 100;

        if (chance > Configs.felix_chance) {
            return;
        }

        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                return;
            }

            stat.points = addPoints(Configs.points_likes, stat.points, guild_member);
            printPoints(this.hourglass_channel, stat.points, true);

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]:  😈`);

                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));



        }).catch(err => logger.log('error', `[${this.name}]: ${err}`));

    }

};

module.exports = (client: Client) => {
    return new Felix(client);
}