const Stat = require('../models/Stat');
const { stats_id } = require('../config/configs');

module.exports = {
    name: "lightningbolts",
    description: 'Get all of the lightningbolt questions for this recording',
    cooldown: 10,
    args: false,
    execute(message, arg) {

        Stat.findById(stats_id).then(stat => {

            let reply = '';
            if (stat.lightnings.length > 0) {

                const lastRecordingDate = stat.lightnings[stat.lightnings.length - 1].date;
                let elapsedTime = Math.abs(currentTime - lastRecordingDate);
                elapsedTime = elapsedTime / 1000;
                elapsedTime = elapsedTime / 60;
                elapsedTime = elapsedTime / 60;

                if (elapsedTime > parseInt(configs.recording_delay)) {
                    return message.channel.send(`${message.author} there are no lightning bolts yet, maybe ask the first one!`);
                }
                reply = 'These are the lightning bolts for this recording:\n\n';

                const number_batches = Math.floor(stat.lightnings.length / 10) + 1;

                for (let index = 0; index < number_batches; index++) {
                    let end = 10 * (index + 1);
                    if (index === number_batches - 1) {
                        end = stat.lightnings.length;
                    }

                    for (let bolt = 10 * index; bolt < end; bolt++) {
                        reply += `${message.guild.member(stat.lightnings[bolt].member)} asks: ${stat.lightnings[bolt].question}\n`;
                    }

                    message.channel.send(reply);
                    reply = '';
                }
            }
            else {
                message.channel.send(`${message.author} there are no lightning bolts yet, maybe ask the first one!`);
            }

        });
    },
};
