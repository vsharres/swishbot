import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';

export class Lightning extends Command {

    constructor(client: Client) {
        super(client, ["lightningbolts", "⚡", "lightingbolts", "lightning_bolts"], false, false, true);
    }

    async execute(message: Message, arg: string[]) {

        Stat.findById(Configs.stats_id).then(async stat => {

            if (!stat) {
                return logger.log('error', `[${this.names[0]}]: Error getting the stat, check the stat id`);
            }

            let reply = '';
            if (stat.lightnings.length > 0) {

                reply = 'These are the lightning bolts for this recording:\n\n';

                const number_batches = Math.floor(stat.lightnings.length / 10) + 1;

                for (let index = 0; index < number_batches; index++) {
                    let end = 10 * (index + 1);
                    if (index === number_batches - 1) {
                        end = stat.lightnings.length;
                    }

                    for (let bolt = 10 * index; bolt < end; bolt++) {
                        let can_show_votes = ``;

                        if (message.channel.id === Configs.channel_bot_talk) {
                            can_show_votes = ` **votes: ${Math.abs(stat.lightnings[bolt].votes)} ${stat.lightnings[bolt].votes >= 0 ? 'up**' : 'down**'}`;
                        }
                        const author = await message.client.users.fetch(stat.lightnings[bolt].member);
                        if (author) {
                            reply += `${author.toString()} asks: ${stat.lightnings[bolt].question}${can_show_votes}\n`;
                        }

                    }

                    message.channel.send(reply);
                    reply = '';
                }

                logger.log('info', `[${this.names[0]}]: ${stat.lightnings.length} were successfully printed.`);
            }
            else {
                return message.channel.send(`${message.author.toString()} there are no lightning bolts yet, maybe ask the first one!`)
                    .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
            }

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Lightning(client); }
