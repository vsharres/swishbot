import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class Plebs extends Command {

    recording_channel: TextChannel;

    constructor(client: Client) {
        super(client, ["plebs", "pleb"], true, false, true);

        this.recording_channel = client.channels.cache.get(Configs.channel_recording) as TextChannel;
    }

    async execute(message: Message, args: string[]) {

        Stat.findById(Configs.stats_id).then((stat) => {
            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            let plebMessage = args.join();
            if (!plebMessage) {
                logger.log('error', `[${this.names[0]}]: Error shifting the house.`);
                return;
            }

            let plebs_message = `@everyone a recording will start shortly!** \n`;

            this.recording_channel
                            .send(plebs_message)
                            .then(() => logger.log('info', `${plebMessage}`))
                            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Plebs(client); }