const Stat = require('../models/Stat');
const {stats_id} = require('../config/configs');

const Delay = 6;

module.exports = {
    name: "recording",
    description: 'Start the recording, prompting the chat for volunteers to be the designater binger',
    cooldown: 30,
    usage: '',
    args: false,
    execute(message,arg) {

        Stat.findById(stats_id).then(stat=>{

            let elapsedTime = Math.abs(Date.now() - stat.recording_date);
            elapsedTime = elapsedTime / 1000;
            elapsedTime = elapsedTime / 60;
            elapsedTime = elapsedTime/60;

            if(elapsedTime < Delay){
                return message.channel.send(`${message.author} the start of the recording has already been set!`)
                .catch(err=>console.log(err));
            }
            else {
                stat.recording_date = Date.now();
                
                stat
                .save()
                .then(stat=>{
                    return message.channel.send(`${message.author} the start of the recording has already been set!`)
                        .catch(err=>console.log(err));
                })
                .catch(err=>console.log(err));

            }

        })
        .catch(err=>console.log(err));

    },
};
