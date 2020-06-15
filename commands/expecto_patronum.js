const User = require('../models/User');
const { MessageAttachment } = require('discord.js');
const { Mongoose } = require('mongoose');

module.exports = {
    name: 'expecto_patronum!',
    desciption:'Cast the patronus spell',
    cooldown: 2,
    args:false,
    execute(message,args) {

        User.findById(message.member.id).then(user=>{
            if(user){
                const attachment = new MessageAttachment(user.patronus);
                message.channel
                .send({
                    content:'Expecto Patronum!! :wand::zap::zap:',
                    files: [attachment]
                })
                .catch(err=>console.log(err));

            }
            else{
                console.log(`${message.member.id} please save your patronus first with the command \`eligere_patronum!\``);
                message.channel
                    .send(`${message.member.id} please save your patronus first with the command \`eligere patronum!\``)
                    .catch(err=>console.log(err));
            }
        });
    },
};
