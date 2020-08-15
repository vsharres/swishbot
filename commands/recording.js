const Stat = require('../models/Stat');
const moment = require('moment-timezone');
const { stats_id } = require('../config/configs');

module.exports = {
    name: "recording",
    description: 'Start the recording, prompting the chat for volunteers to be the head pupil',
    cooldown: 30,
    usage: '<date> <time>',
    admin: true,
    args: true,
    execute(message, args, logger) {

        const date_string = moment.tz(args.join(' '), "DD MMM YYYY hh:mm aa", 'America/New_York');

        if (!date_string.isValid()) {
            return;
        }

        Stat.findById(stats_id).then(stat => {

            stat.recording_date = date_string.toDate();
            stat.lightnings = [];
            stat
                .save()
                .then(() => {
                    message.reply(`New recording set to ${date_string}`);
                    logger.log('info', `New recording set to ${date_string}`);
                })
                .catch(err => logger.log('error', err));
        })
            .catch(err => logger.log('error', err));
    },
};
