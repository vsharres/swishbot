import Stat from '../models/Stat';
import moment from 'moment-timezone';
import { Configs } from '../config/configs';
import { Message } from 'discord.js'
import { Logger } from 'winston';
import { Command } from './command';

export class Countdown extends Command {

    constructor() {
        super(["countdown"], 'Counts down until the next recording', 5, '');
    }

    async execute(message: Message, args: string[], logger: Logger) {

        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                return logger.log('error', 'Stats was invalid check id');
            }

            let time_to_recording = moment(stat.recording_date);
            const time_now = moment(Date.now());

            //for the case where the recording already happened
            if (time_to_recording.diff(time_now, 'hours') < 0) {
                const member = message.member;
                if (member) {
                    return member.createDM()
                        .then(channel => {
                            channel.send(`There is no recording scheduled yet! Keep up on a lookout for the next one in the #annoucements channel!`)
                                .then(() => logger.log('log', `There is no recording scheduled yet! Keep up on a lookout for the next one in the #annoucements channel!`))
                                .catch(err => logger.log('error', err));
                        })
                        .catch(err => logger.log('error', err));
                }

            }

            const member = message.member;
            const time = time_now.to(time_to_recording);
            if (member) {
                member.createDM()
                    .then(async channel => {
                        try {
                            channel.send(`The next recording will be ${time}`);
                            return logger.log('info', `The next recording will be ${time}`);
                        } catch (err) {
                            return logger.log('error', err);
                        }

                    })
                    .catch(err => logger.log('error', err));
            }

        })
            .catch(err => { return logger.log('error', err) });
    }
};

export default new Countdown();
