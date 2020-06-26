const Stat = require('../models/Stat');
const {stats_id} = require('../config/configs');

module.exports = {
    name: "lightningbolts",
    description: 'Get all of the lightningbolt questions for this recording',
    cooldown: 1,
    args: false,
    execute(message,arg){

        Stat.findById(stats_id).then(stat=> {

            
                let reply = '';
            if(stat.lightnings.length >0){
                reply = 'These are the lightning bolts for this recording:\n';
                stat.lightnings.forEach(bolt=> {
                    reply += `${message.guild.member(bolt.member)} asks: ${bolt.question}\n`;
                });
            }
            else{
                reply = `${message.author} there are no lightning bolts yet, maybe ask the first one!`;
            }    

            return message.channel.send(reply);
        });
    },
};
