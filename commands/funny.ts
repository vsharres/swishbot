import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class Funny extends Command {

    constructor() {
        super(["funny", "🥸"], false, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(async stat => {

            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            let reply = '';
            if (stat.funnies.length > 0) {

                reply = 'These are the funnies for this recording:\n\n';

                const number_batches = Math.floor(stat.funnies.length / 10) + 1;

                for (let index = 0; index < number_batches; index++) {
                    let end = 10 * (index + 1);
                    if (index === number_batches - 1) {
                        end = stat.funnies.length;
                    }

                    for (let funny = 10 * index; funny < end; funny++) {

                        const funny_message_channel = <TextChannel>message.client.channels.cache.get(stat.funnies[funny].channel_id);

                        if (funny_message_channel) {

                            const funny_messages = await funny_message_channel.messages.fetch();

                            const funny_message = funny_messages.get(stat.funnies[funny].message_id);
                            if (funny_message) {
                                reply += `${funny_message.author.toString()} said: ${funny_message.content}\n${funny_message.attachments.size > 0 ? funny_message.attachments.first()?.url + '\n' : ''}`;

                            }

                        }

                        message.channel.send(reply);
                        reply = '';
                    }
                }

                logger.log('info', `[${this.names[0]}]: ${stat.funnies.length} were successfully printed.`);
            }
            else {
                return message.channel.send(`${message.author.toString()} there are no funnies yet.`)
                    .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
            }

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default new Funny();