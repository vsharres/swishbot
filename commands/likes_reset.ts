import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import logger from '../tools/logger';
import { Command } from './command';
import { Message } from 'discord.js';

export class LikesReset extends Command {

    constructor() {
        super(["likes_reset", "reset_likes"], '', 10, '', false, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat)
                return;

            stat.likes = new Map<string, number>();

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.names[0]}]:The map of likes has been reset.`);
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default new LikesReset();