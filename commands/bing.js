const Stat = require('../models/Stat');
const { stats_id, admin_role_name } = require('../config/configs');

module.exports = {
    name: "bing",
    description: 'Converts the provided number to devitos',
    cooldown: 5,
    usage: '',
    args: false,
    execute(message, arg) {

        Stat.findById(stats_id).then(stat => {
            if (!stat)
                return;

            let roles = message.member.roles.cache.find(role => role.name === admin_role_name);

            if (stat.binger === message.member.id || roles) {

                let bings = stat.bings;
                bings++;
                stat.bings = bings;

                stat
                    .save()
                    .then(stat => {
                        console.log(`The total of bings is ${stat.bings}!`);
                        message.channel
                            .send(`:bellhop:!`)
                            .catch(err => console.log(err));

                    })
                    .catch(err => console.log(err));
            }
        });
    },
};
