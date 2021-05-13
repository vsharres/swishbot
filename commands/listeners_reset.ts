import Stat, { Listener } from '../models/Stat';
import { Configs } from '../config/configs';
import logger from '../tools/logger';
import { Command } from './command';
import { Client, Message } from 'discord.js';

export class ListenersReset extends Command {

    constructor(client: Client) {
        super(client, ["listeners_reset", "reset_listeners"], false, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat)
                return;

            stat.listening_members = new Array<Listener>();

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

export default (client: Client) => { return new ListenersReset(client) };