const Stat = require('../models/Stat');
const { stats_id } = require('../config/configs');

module.exports = {
    name: 'bings_reset',
    description: 'Resets the number of bings',
    cooldown: 1,
    admin: true,
    args: false,
    execute(message, arg) {

        Stat.findById(stats_id).then(stat => {
            if (!stat)
                return;

            stat.bings = 0;
            stat.binger = 0;

            stat
                .save()
                .then(stat => {
                    console.log(`The total of :bellhop: is ${stat.bings}`);
                })
                .catch(err => console.log(err));
        });
    },
};