import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printcokes } from '../tools/print_cokes';
import { Client, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class CokesReset extends Command {

    cokes_channel: TextChannel;

    constructor(client: Client) {
        super(client, ["cokes_reset", "reset_cokes"], false, false, true);

        this.cokes_channel = client.channels.cache.get(Configs.channel_cokes) as TextChannel;
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) return;

            stat.cokes = { megan_katie: 0, tiff_katie: 0, tiff_megan: 0 };

            printcokes(this.cokes_channel, stat.cokes, true);

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.names[0]}]: All house points are reset.`);
                    message.channel.send(` All house points are reset.`);
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new CokesReset(client) };