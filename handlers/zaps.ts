import { Client } from 'discord.js';
import { Logger } from 'winston';
import { Handler } from './handler';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';

export class Zaps extends Handler {

    constructor(client: Client, logger: Logger) {
        super('zaps', 'handler to get all of the zap questions', client, logger);
    }

    async On() {
        const client = this.client;
        //Listening to lightningbolts
        client.on('message', async message => {
            if (!message.content.startsWith('⚡')) return;

            Stat.findById(Configs.stats_id).then((stat) => {

                if (!stat) {
                    return;
                }

                let elapsed_time = Date.now() - stat.recording_date.getTime();
                elapsed_time = elapsed_time / 1000;
                elapsed_time = elapsed_time / 60;
                elapsed_time = elapsed_time / 60;

                if (elapsed_time > parseFloat(Configs.recording_delay)) {
                    stat.lightnings = [];
                    stat.recording_date = new Date();
                }

                const question = {
                    member: message.author.id,
                    question: message.content,
                };

                stat.lightnings.push(question);
                stat
                    .save()
                    .then(() => {
                        this.logger.log('info', `Lightning bolt saved: ${message.content}`);
                        message.reply(`Your lightning bolt question was saved!`);
                    })
                    .catch(err => this.logger.log('error', err));

            }).catch(err => this.logger.log('error', err));

        });
    }

};
