import { Client, Events, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { BotEvent } from '../bot-types';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';

export class Zaps extends BotEvent {

    bot_talk: TextChannel;

    constructor(client: Client) {
        super(client, 'zaps', Events.MessageCreate, true);

        this.bot_talk = client.channels.cache.get(Configs.channel_bot_talk) as TextChannel;
    }

    async execute(message: Message) {

        if (!message.content.startsWith('⚡') || message.author.bot || message.content.length <= 2) return;

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

            this.bot_talk.send(message.content);
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

export default (client: Client) => { return new Zaps(client); }