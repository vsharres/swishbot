import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, TextChannel } from 'discord.js';
import logger from './logger';
import cron from 'node-cron';

export class Scheduler {

    client: Client;
    noticeboard_channel: TextChannel;

    constructor(client: Client) {
        this.client = client;
        this.noticeboard_channel = client.channels.cache.get(Configs.channel_noticeboard) as TextChannel;
    }

    async LoadSchedule() {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) return;

            stat.recordings.forEach((recording) => {

                cron.schedule(recording.date, () => {

                    if (!stat.recordings.has(recording.date)) {
                        return;
                    }
                    this.noticeboard_channel.send(`@here **A new recording will start in 1 hour!**`);
                    stat.recordings.delete(recording.date);

                    stat.save()
                        .then(() => {
                            logger.log('info', `[Scheduler]: Recording schedule removed.`);
                        })

                }, {
                    scheduled: true,
                    timezone: "America/New_York"
                });

            });

        })
            .catch(err => logger.log('error', `[Scheduler]: ${err}`));

    }

}

module.exports = (client: Client) => {
    return new Scheduler(client);
}