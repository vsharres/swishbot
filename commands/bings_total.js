const Stat = require('../models/Stat');
const {stats_id} = require('../config/configs');

module.exports = {
    name: 'bings?',
    description: 'Get the total number of bings',
    cooldown: 1,
    args: false,
    execute(message,arg) {

        Stat.findById(stats_id).then(stat=> {
            if(!stat)
                return;       

            message.channel
            .send(`${message.author} the total of :bellhop: so far is ${stat.bings}!`)
            .catch(err=>console.log(err));

        });
    },
};