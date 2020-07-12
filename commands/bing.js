const Stat = require('../models/Stat');
const { stats_id, admin_role_id } = require('../config/configs');

module.exports = {
    name: "bing",
    description: 'Converts the provided number to devitos',
    cooldown: 5,
    usage: '',
    args: false,
    execute(message, arg, logger) {

        Stat.findById(stats_id).then(stat => {
            if (!stat)
                return;

            const role = message.member.roles.cache.get(admin_role_id);

            if (stat.binger === message.member.id || role) {

                let bings = stat.bings;
                bings++;
                stat.bings = bings;

                stat
                    .save()
                    .then(stat => {
                        logger.log('info', `The total of bings is ${stat.bings}!`);
                        message.channel
                            .send(`:bellhop:!`)
                            .catch(err => logger.log(err));

                    })
                    .catch(err => logger.log('error', err));
            }
        });
    },
};
