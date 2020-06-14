const Discord = require('discord.js');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const fs = require('fs');
const { token, prefix } = require('./config/config');

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

    if(!message.content.startsWith(prefix)  || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    args.shift();
    const commandName = args.shift().toLowerCase();
    
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        console.log(timeLeft);
        return;
		//return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
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

express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
