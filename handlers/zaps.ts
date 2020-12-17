import { Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';

export class Zaps extends Handler {

    constructor() {
        super('zaps', true);
    }

    async OnMessage(message: Message) {

        if (!message.content.startsWith('⚡') || message.author.bot) return;

        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                return;
            }

            const question = {
                member: message.author.id,
                question: message.content,
                votes: 0,
                was_awarded: false
            };
            const guild = message.guild;
            if (!guild) {
                return;
            }

            const bot_talk = <TextChannel>guild.channels.cache.get(Configs.channel_bot_talk);
            bot_talk.send(message.content);
            stat.lightnings.push(question);
            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: Lightning bolt saved: ${message.content}`);

                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));

        }).catch(err => logger.log('error', `[${this.name}]: ${err}`));

    }

};

export default new Zaps();
