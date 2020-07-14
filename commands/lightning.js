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

                reply = 'These are the lightning bolts for this recording:\n\n';

                let number_batches = Math.floor(stat.lightnings.length / 10) + 1;

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
                reply = `${message.author} there are no lightning bolts yet, maybe ask the first one!`;
            }

        });
    },
};
