import Stat, { AuthorsArray } from '../models/Stat';
import { Configs } from '../config/configs';
import logger from '../tools/logger';
import { Command } from './command';
import { Client, Message } from 'discord.js';

export class LikesReset extends Command {

    constructor(client: Client) {
        super(client, ["likes_reset", "reset_likes"], false, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat)
                return;

            stat.likes = new Map<string, AuthorsArray>();

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.names[0]}]:The map of likes has been reset.`);
                    message.channel.send(`The counter of likes was reset.`);
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new LikesReset(client) };