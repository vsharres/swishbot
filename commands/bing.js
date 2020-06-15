const Stat = require('../models/Stat');
const {stats_id} = require('../config/configs');

module.exports = {
    name: "bing!",
    description: 'Converts the provided number to devitos',
    cooldown: 1,
    args: false,
    execute(message,arg) {

        Stat.findById(stats_id).then(stat=> {
            if(!stat)
                return;

            let bings = stat.bings;
            bings++;
            stat.bings = bings;

            stat
            .save()
            .then(stat=> {
                console.log(`The total of bings is ${stat.bings}`);
                
                message.channel
                .send(`:bellhop:!`)
                .catch(err=>console.log(err));

            })
            .catch(err=> console.log(err));
        });
    },
};
