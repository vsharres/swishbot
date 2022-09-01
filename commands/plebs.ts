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

            let channel_to_send_message = args.shift();
            if(!channel_to_send_message){
                logger.log('error', `[${this.names[0]}]: We need a message to send to the plebs.`);
                return;
            }

            channel_to_send_message = channel_to_send_message.replace(/[^a-zA-Z0-9 ]/g, "");

            let channel =  this.client.channels.cache.get(channel_to_send_message) as TextChannel;
            if(!channel){
                logger.log('error', `[${this.names[0]}]: Could not find the channel with id ${channel_to_send_message}`);
                return;
            }

            let plebMessage = args.join(' ');
            if (!plebMessage) {
                logger.log('error', `[${this.names[0]}]: We need a message to send to the plebs.`);
                return;
            }



            channel
                    .send({
                        content: plebMessage,
                        attachments: Array.from(message.attachments.values())
                    })
                    .then(() => logger.log('info', `${plebMessage}`))
                    .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Plebs(client); }