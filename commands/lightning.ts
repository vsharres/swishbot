import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message } from 'discord.js';
import { Logger } from 'winston';
import { Command } from './command';

export class Lightning extends Command {

    constructor() {
        super("lightningbolts", 'Get all of the lightningbolt questions for this recording', 10, '');
    }

    async execute(message: Message, arg: string[], logger: Logger) {

        Stat.findById(Configs.stats_id).then(stat => {

            if (!stat) {
                return logger.log('error', 'Error getting the stat, check the stat id');
            }

            let reply = '';
            if (stat.lightnings.length > 0) {

                reply = 'These are the lightning bolts for this recording:\n\n';

                const number_batches = Math.floor(stat.lightnings.length / 10) + 1;
                const guild = message.guild;
                if (!guild) {
                    return logger.log('error', 'Error getting the guild, check id');
                }

                for (let index = 0; index < number_batches; index++) {
                    let end = 10 * (index + 1);
                    if (index === number_batches - 1) {
                        end = stat.lightnings.length;
                    }

                    for (let bolt = 10 * index; bolt < end; bolt++) {
                        reply += `${guild.member(stat.lightnings[bolt].member)?.toString()} asks: ${stat.lightnings[bolt].question}\n`;
                    }

                    message.channel.send(reply);
                    reply = '';
                }
            }
            else {
                return message.channel.send(`${message.author.toString()} there are no lightning bolts yet, maybe ask the first one!`)
                    .catch(err => logger.log('error', err));
            }

        })
            .catch(err => logger.log('error', err));
    }
};

export default new Lightning();
