import Stat, { AuthorsArray, Lightning, Poll, Recording } from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { Client, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class Reset extends Command {

    hourglass_channel: TextChannel;

    constructor(client: Client) {
        super(client, ["reset"], false, false, true);

        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) return;

            stat.points = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };
            stat.likes = new Map<string, AuthorsArray>();
            stat.lightnings = new Array<Lightning>();
            stat.polls = new Array<Poll>();

            printPoints(this.hourglass_channel, stat.points, true);

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.names[0]}]: Points, Likes, zaps and polls are all reset.`);
                    message.channel.send(`Points, Likes, zaps and polls are all reset.`);
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Reset(client) };