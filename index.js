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

const Stat = require('./models/Stat');
const { CLIENT_RENEG_LIMIT } = require('tls');
const { find } = require('./models/Stat');

const client = new Discord.Client({partials: ['REACTION', 'MESSAGE']});
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let hourglass_channel; 

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.once('ready', () => {
    console.log('Ready!');

    hourglass_channel =  client.channels.cache.find(channel=> 
        channel.name === configs.house_points_channel
    );
});

client.on('messageReactionAdd', async (reaction, user) => {

    if(reaction.partial){

        try {
            await reaction.fetch();
        }
        catch(error){
            console.log(`Something went wrong when fetching the message: ${error}`);
            return;
        }
    }

    if(user.partial){

        try{
            await user.fetch();

        }
        catch(error){
            console.log(`Something went wrong when fetching the user: ${error}`);
            return;
        }
    }

    //Only the founders can add points to houses and only in the general channel points are being awarded.
    const guildMember = reaction.message.guild.members.cache.get(user.id);
    if(!guildMember) return;
    const adminRole = guildMember.roles.cache.some(role=> role.name ===configs.admin_role_name);

    const general = reaction.message.channel.name === '💬│general';
    if(!adminRole && !general) return;

    let pointsToAdd = {
        gryffindor: 0,
        slytherin:0,
        ravenclaw:0,
        hufflepuff:0
    };

    //CHANGE THIS
    reaction.message.member.roles.cache.forEach(role=> {

        if(role.name === configs.gryffindor_role){
            if(reaction.emoji.identifier === configs.emoji_addpoints){
                pointsToAdd.gryffindor +=10;
            }
            else if(reaction.emoji.identifier === configs.emoji_removepoints){
                pointsToAdd.gryffindor -=10;
            }
        }
        else if(role.name === configs.ravenclaw_role){
            if(reaction.emoji.identifier  === configs.emoji_addpoints){
                pointsToAdd.ravenclaw +=10;
            }
            else if(reaction.emoji.identifier  === configs.emoji_removepoints){
                pointsToAdd.ravenclaw -=10;
            }
        }
        else if(role.name === configs.slytherin_role){
            if(reaction.emoji.identifier === configs.emoji_addpoints){
                pointsToAdd.slytherin +=10;
            }
            else if(reaction.emoji.identifier === configs.emoji_removepoints){
                pointsToAdd.slytherin -=10;
            }
        }
        else if(role.name === configs.hufflepuff_role){
            if(reaction.emoji.identifier === configs.emoji_addpoints){
                pointsToAdd.hufflepuff +=10;
            }
            else if(reaction.emoji.identifier === configs.emoji_removepoints){
                pointsToAdd.hufflepuff -=10;
            }
        }

    });

    //Return if there is no points to add, this is a sanity check, in the usual mode, this wouldn't be a problem
    if(pointsToAdd.gryffindor === 0  && pointsToAdd.slytherin === 0 && pointsToAdd.ravenclaw === 0 && pointsToAdd.hufflepuff === 0) return;

    Stat.findById(configs.stats_id).then(stat=> {

        let points = stat.points[stat.points.length-1];
        points.gryffindor += pointsToAdd.gryffindor;
        points.ravenclaw += pointsToAdd.ravenclaw;
        points.slytherin += pointsToAdd.slytherin;
        points.hufflepuff += pointsToAdd.hufflepuff;

        stat
        .save()
        .then(stat=> {
            console.log('Points saved!');

            
            if(pointsToAdd.gryffindor != 0){
                reaction.message.channel.send(`**${pointsToAdd.gryffindor} points ${ pointsToAdd.gryffindor > 0 ? 'to' : 'from'} Gryffindor 🦁!**`);
            }
            else if(pointsToAdd.slytherin != 0){
                reaction.message.channel.send(`**${pointsToAdd.slytherin} points ${ pointsToAdd.slytherin > 0 ? 'to' : 'from'} Slytherin 🐍!**`);
            }
            else if(pointsToAdd.ravenclaw != 0){
                reaction.message.channel.send(`**${pointsToAdd.ravenclaw} points ${ pointsToAdd.ravenclaw > 0 ? 'to' : 'from'} Ravenclaw 🦅!**`);
            }
            else if(pointsToAdd.hufflepuff != 0){
                reaction.message.channel.send(`**${pointsToAdd.hufflepuff} points ${ pointsToAdd.hufflepuff > 0 ? 'to' : 'from'} Hufflepuff 🦡!**`);
            }
            

            //Delete the previous message
            hourglass_channel.bulkDelete(5)
                .then(messages=> {
                    console.log(`Bulk deleted ${messages.size} messages`);
                })
                .catch(console.error);

            let houses = [{
                name:'Gryffindor 🦁',
                points: points.gryffindor
            }, 
            { 
                name: 'Slytherin 🐍',
                points: points.slytherin
            },
            {
                name: 'Ravenclaw 🦅',
                points: points.ravenclaw
            },
            {
                name:'Hufflepuff 🦡',
                points: points.hufflepuff
            }
            ];

            houses.sort((a,b)=> b.points - a.points);
            let reply = '**House Points**\n\n';

            houses.forEach(house=> {
                reply += `${house.name} with a total of: **${house.points}!**\n\n`;
            });

            return hourglass_channel.send(reply);
            
        });  

    });

});

//Listening to lightninbolts
client.on('message', message => {
    const prefix = '\u26a1';
    if(!message.content.startsWith(prefix)) return;

    const currentTime = Date.now();

    Stat.findById(configs.stats_id).then(stat=> {

        if(stat.lightnings.length > 0){
            const lastRecordingDate = stat.lightnings[stat.lightnings.length-1].recording_date;
            let elapsedTime = Math.abs(currentTime - lastRecordingDate);

            elapsedTime = elapsedTime / 1000;
            elapsedTime = elapsedTime / 60;
            elapsedTime = elapsedTime/60;

            if(elapsedTime > configs.recording_delay)
            {
                stat.lightnings = [];
            }
        }   

        const question =  {
            member: message.member.id,
            question: message.content,
            recording_date:currentTime
        };

        stat.lightnings.push(question);
        
        stat
        .save()
        .then(stat=>console.log(`lightning bolt question saved!`))
        .catch(err=> console.log(err));      

    }).catch(err=> console.log(err));

});

//Responding to DMs
client.on('message',  message => {
    if(message.channel.type !== 'dm' || message.author.id === client.user.id) return;
    client.users.fetch(configs.vini_id)
        .then(user=> {
            message.reply(`If you have any questions relating to how the bot works, please feel free to DM ${user} :smile:`);
        })
        .catch(err=> console.log(err));
});

//General commands given to the bot
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
        return message.member.createDM()
        .then(channel=> {
            channel.send(reply)
                    .catch(err=>console.error(err));
        })
        .catch(err=>console.error(err));
    }

    if(command.attachments && message.attachments.size === 0){
        let reply = `You didn't provide any attachment, ${message.author}!`;
        if(command.usage){
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.member.createDM()
        .then(channel=> {
            channel.send(reply)
                    .catch(err=>console.error(err));
        })
        .catch(err=>console.error(err));
    }
    else if(command.attachments && message.attachments.size > 0 )
    {
        if( message.attachments.first().width > command.attachment_size || message.attachments.first().height > command.attachment_size){
            return message.member.createDM()
            .then(channel=> {
                channel.send(`${message.author} the patronus image must be smaller than ${command.attachment_size}x${command.attachment_size}!`)
                        .catch(err=>console.error(err));
        })
            .catch(err=>console.error(err));
        }
    }

    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        console.log(timeLeft);
        return message.member.createDM()
                    .then(channel=> {
                        channel.send(`Hello ${message.author} please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                                .catch(err=>console.error(err));
                })
                    .catch(err=>console.error(err));
	}
    }

    timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
    console.error(error);
    message.member.createDM()
                    .then(channel=> {
                        channel.send('there was an error trying to execute that command!')
                                .catch(err=>console.error(err));
                })
                    .catch(err=>console.error(err));
    }

   
	console.log(message.content);
});

client.login(token);
