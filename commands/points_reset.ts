import Stat, { AuthorsArray, Funny, Lightning } from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { Client, Guild, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class PointsReset extends Command {

    hourglass_channel: TextChannel;
    guild: Guild;

    constructor(client: Client) {
        super(client, ["points_reset", "reset_points"], false, false, true);

        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
        this.guild = client.guilds.cache.get(Configs.guild_id) as Guild;
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) return;

            stat.points = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };
            stat.likes = new Map<string, AuthorsArray>();
            stat.lightnings = new Array<Lightning>();
            stat.funnies = new Array<Funny>();

            const guild = message.guild;
            if (!guild) return;


            printPoints(this.hourglass_channel, stat.points, true);

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.names[0]}]:A new year has begun! All house points are reset.`);
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new PointsReset(client) };