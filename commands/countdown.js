const Stat = require('../models/Stat');
const moment = require('moment');
const { stats_id, fletcher_id } = require('../config/configs');

module.exports = {
    name: "countdown",
    description: 'Counts down until the next recording',
    cooldown: 30,
    usage: '',
    execute(message, args, logger) {

        Stat.findById(stats_id).then(stat => {

            let time_to_recording = moment(stat.recording_date);
            const time_now = moment(Date.now());

            //for the case where the recording already happened
            if (time_to_recording.diff(time_now, 'hours') < 0) {
                message.member.createDM()
                    .then(channel => {
                        return channel.send(`There is no recording schedule yet! Keep up on a lookout for the next one in the #annoucements channel!`)
                            .catch(err => logger.log('error', err));
                    })
                    .catch(err => logger.log('error', err));
            }

            //lolz
            if (message.author.id === fletcher_id) {
                time_to_recording += randomNumber(-10, 10) * 1000 * 60 * 60;
            }

            message.member.createDM()
                .then(channel => {
                    return channel.send(`The next recording will be ${time_now.to(time_to_recording)}`)
                        .catch(err => logger.log('error', err));
                })
                .catch(err => logger.log('error', err));
            logger.log('info', `The next recording will be ${time_now.to(time_to_recording)}`);

        })
            .catch(err => logger.log('error', err));
    },
};

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
};