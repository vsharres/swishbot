const Stat = require('../models/Stat');
const { MessageAttachment } = require('discord.js');
const {stats_id, admin_role_name, binger_gif, command_prefix} = require('../config/configs');

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
                stat.binger = '';
                return stat
                .save()
                .then(stat=> {
                    console.log(`Binger reset by the admin`);                    
                    message.channel
                    .send(`Binger successfully reset!`)
                    .catch(err=>console.log(err));
                })
                .catch(err=>console.log(err));
            }

            if(stat.binger === ''){

                stat.binger = message.member.id;
                return stat
                .save()
                .then(stat=> {
                    console.log(`Binger set to the id: ${stat.binger}`);
                    const prefix = message.guild.emojis.cache.find(emoji => emoji.name === command_prefix).toString();
                    const attachment =  new MessageAttachment(binger_gif);                  
                    message.channel
                    .send( {
                        content: `${message.author} Congrats!\nYou're the designated Binger:tm: for this recording! Use your bell powers with care!\n\nThe command to add another bellring is: **${prefix} bing**`,
                        files: [attachment]
                    })
                    .catch(err=>console.log(err));
                });


            }
        
        })
        .catch(err=>console.log(err));


    },
};
