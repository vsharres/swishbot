const Stat = require('../models/Stat');
const { MessageAttachment } = require('discord.js');
const {stats_id, admin_role_name, binger_gif} = require('../config/configs');

module.exports = {
    name: "binger",
    description: 'Sets the designated binger for the recording',
    cooldown: 60,
    args: false,
    execute(message,args) { 

        Stat.findById(stats_id).then(stat=> { 
            
            let reset = args.shift();
            let roles = message.member.roles.cache.find(role => role.name === admin_role_name);

            if(reset === 'reset' && roles)
            {
                stat.binger = 0;
                stat
                .save()
                .then(stat=> {
                    console.log(`Binger reset by the admin`);                    
                    return message.channel
                    .send(`Binger successfully reset!`)
                    .catch(err=>console.log(err));
                });
            }

            if(stat.binger !== 0 && stat.binger !== message.member.id) return;

            if(stat.binger === 0){

                stat.binger = message.member.id;
                stat
                .save()
                .then(stat=> {
                    console.log(`Binger set to the id: ${stat.binger}`);
                    const attachment =  new MessageAttachment(binger_gif);                  
                    return message.channel
                    .send( {
                        content: `${message.author} Congrats! \nYou're the designated Binger:tm: for this recording! Use your bell powers with care! \n`,
                        files: [attachment]
                    })
                    .catch(err=>console.log(err));
                });


            }
        
        });


    },
};
