import Stat, { Funny } from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class FunnyReset extends Command {

    constructor(client: Client) {
        super(client, ["funny_reset", "reset_funny"], false, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {

            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            stat.funnies = new Array<Funny>();

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.names[0]}]: All of the funny moments are reset`);
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new FunnyReset(client); }