import Stat, { Recording } from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import cron from 'node-cron';

export class Schedule extends Command {

    noticeboard_channel: TextChannel;

    constructor(client: Client) {
        super(client, ["schedule"], true, false, true);

        this.noticeboard_channel = client.channels.cache.get(Configs.channel_noticeboard) as TextChannel;
    }

    async execute(message: Message, arg: string[]) {

        if (!arg[0].startsWith('"')) {
            //add error message
            return;
        }

        let is_replay = arg.some(arg => arg === '-replay');

        let description_end = false;
        let description = '';

        while (!description_end) {
            let word = arg.shift();
            description += `${word} `;

            if (word?.endsWith('"')) {
                description_end = true;
            }

        }

        description = description.replace('"', '');
        description = description.replace('"', '');

        const minutes = arg.shift();
        let hours = arg.shift();
        if (hours) {
            hours = `${(parseInt(hours) - 1) % 24}`;
        }
        const days = arg.shift();
        const month = arg.shift();

        let parsed_time = `${minutes} ${hours} ${days} ${month} *`;

        if (!cron.validate(parsed_time)) {
            logger.log('error', `[${this.names[0]}]: Error parsing the time ${parsed_time}`);
            return;
        }

        //MAKE THE CRON TIME


        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) return;

            let new_recording: Recording = { message: description, date: parsed_time };

            stat.recordings.set(new_recording.date, new_recording);

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.names[0]}]: A new recording was set!\n\n ${description}`);
                    message.channel.send(`A new recording was set\n\n${description}`);

                    cron.schedule(parsed_time, () => {

                        this.noticeboard_channel.send(`@here **A new ${is_replay ? 'replay' : 'recording'} will start in 1 hour!**`);
                        stat.recordings.delete(new_recording.date);

                        stat.save()
                            .then(() => {
                                logger.log('info', `[${this.names[0]}]: Recording schedule removed.`);
                            })

                    }, {
                        scheduled: true,
                        timezone: "America/New_York"
                    });

                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));

        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Schedule(client) };