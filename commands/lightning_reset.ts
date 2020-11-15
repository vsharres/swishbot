import Stat, { Lightning } from '../models/Stat';
import { Configs } from '../config/configs';
import { Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class LightningReset extends Command {

    constructor() {
        super(["lightning_reset", "reset_lightning"], 'Reset all of the lightning bolts', 10, '', false, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {

            if (!stat) {
                return logger.log('error', `[${this.names[0]}]:Error getting the stat, check the stat id`);
            }

            stat.lightnings = new Array<Lightning>();

            stat
                .save()
                .then(() => {
                    logger.log('info', `All of the lightning bolts are reset.`);
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default new LightningReset();