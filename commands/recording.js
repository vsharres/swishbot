const Stat = require('../models/Stat');
const { stats_id, command_prefix, recording_delay } = require('../config/configs');

module.exports = {
    name: "recording",
    description: 'Start the recording, prompting the chat for volunteers to be the designater binger',
    cooldown: 30,
    usage: '',
    args: false,
    execute(message, arg, logger) {

        Stat.findById(stats_id).then(stat => {

            let elapsedTime = Date.now() - stat.recording_date;
            elapsedTime = elapsedTime / 1000;
            elapsedTime = elapsedTime / 60;
            elapsedTime = elapsedTime / 60;

            if (elapsedTime < recording_delay) {
                return message.channel.send(`${message.author} the start of the recording has already been set!`)
                    .catch(err => logger.log('error', err));
            }
            else {
                stat.recording_date = Date.now();
                stat.binger = '';
                stat
                    .save()
                    .then(stat => {
                        message.channel.send(`Recording started!`)
                            .catch(err => logger.log('error', err));
                    })
                    .catch(err => logger.log('error', err));
            }

        })
            .catch(err => logger.log('error', err));
    },
};
