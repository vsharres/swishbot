const Discord = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const { command_prefix,token } = require('./config/configs');
const configs = require('./config/configs');

const db = require('./config/configs').mongoURI;

mongoose
  .connect(
    db,
    { useUnifiedTopology: true,
        useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {

    //Ignores all messages and commands send to the bot from DM
    if(!message.guild) return;

    const prefix = message.guild.emojis.cache.find(emoji => emoji.name === command_prefix).toString();
    if(!message.content.startsWith(prefix)  || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    args.shift();
    let commandName = args.shift();
    if(!commandName) return;
    commandName = commandName.toLowerCase();
    
    if (!client.commands.has(commandName) ) 
    {
        console.log(`Couldn't find the command ${commandName}`);
        return;
    }


    const command = client.commands.get(commandName);
    const adminRole = message.member.roles.cache.find(role=> role.name ===configs.admin_role_name );

    if(command.admin && !adminRole)
    {
        console.log(`${message.author} does not have the necessary role to execute this command. The necessary role is ${configs.admin_role_name}`);
        return;
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);

    if((command.args && !args.length) || (command.attachments && message.attachments.size === 0)){
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if(command.usage){
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

    if(command.attachments && message.attachments.size === 0){
        let reply = `You didn't provide any attachment, ${message.author}!`;
        if(command.usage){
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }
    else if(command.attachments && message.attachments.size > 0 )
    {
        if( message.attachments.first().width > command.attachment_size || message.attachments.first().height > command.attachment_size){
            return message.channel.send(`${message.author} the patronus image must be smaller than ${command.attachment_size}x${command.attachment_size}!`);
        }
    }

    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        console.log(timeLeft);
		return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
	}
    }

    timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
	console.error(error);
	message.reply('there was an error trying to execute that command!');
    }

   
	console.log(message.content);
});

client.login(token);
