const User = require('../models/User');
const Discord = require('discord.js');
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./${file}`);
    commands.set(command.name, command);
}

module.exports = {
    name: "spells",
    description: 'Prints all of the available commands for this user',
    cooldown: 1,
    args: false,
    async execute(message,args){
  
        User.findById(message.member.id).then(user=> {
            if(user)
            {
                let reply = `the available commands are: \n`;

                commands.each( command=> reply += `${command.name ? `name: ${command.name}`:''} ${command.usage ? `usage: ${command.usage}` : ''}\n` );

                return message.reply(reply);
            }
        });
    }
};
