const Discord = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const { command_prefix, token } = require('./config/configs');
const configs = require('./config/configs');
const winston = require('winston');
const db = require('./config/configs').mongoURI;

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log' }),
    ],
    format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

mongoose
    .connect(
        db,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    )
    .then(() => logger.log('info', 'MongoDB Connected'))
    .catch(err => logger.log('error', err));

const Stat = require('./models/Stat');

const client = new Discord.Client({ partials: ['REACTION', 'MESSAGE'] });

client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    logger.log('info', 'Ready!');

});

//Special action to the hosts
/** 
client.on('message', async message => {

    const chance = Math.random();
    let attachment;
    let stat;
    let points;

    try {

        switch (message.author.id) {
            case configs.megan_id:
                if (chance > 1 / configs.message_chance) return;

                stat = await Stat.findById(configs.stats_id);
                points = stat.points[stat.points.length - 1];

                points.slytherin += 20;
                attachment = new Discord.MessageAttachment(configs.snape_emoji);

                message.reply({ content: `as you're the best example of a good one of us (these are pretty rare!), **20 points** to Slytherin 🐍!`, files: [attachment] });
                break;
            case configs.tiff_id:
                if (chance > 1 / configs.message_chance) return;

                stat = await Stat.findById(configs.stats_id);
                points = stat.points[stat.points.length - 1];

                points.gryffindor += 20;
                attachment = new Discord.MessageAttachment(configs.dumbly_emoji);

                message.reply({ content: `for being my favorite person in the best house, **20 points** to Gryffindor 🦁! (from your man, Dumbly)`, files: [attachment] });
                break;

            case configs.katie_id:
                if (chance > 1 / configs.message_chance) return;
                stat = await Stat.findById(configs.stats_id);
                points = stat.points[stat.points.length - 1];

                points.hufflepuff += 20;
                attachment = new Discord.MessageAttachment(configs.lupin_emoji);
                message.reply({ content: `to my fellow master of snacks, **20 points** to Hufflepuff 🦡!`, files: [attachment] });

                break;

            case configs.sarah_id:
                if (chance > 1 / configs.message_chance) return;

                stat = await Stat.findById(configs.stats_id);
                points = stat.points[stat.points.length - 1];

                points.ravenclaw += 20;
                attachment = new Discord.MessageAttachment(configs.neville_emoji);
                message.reply({ content: `in honor of not quitting the pod, the hottest thing to come out of Hogwarts would like to award you **20 points** to Ravenclaw 🦅!`, files: [attachment] });

                break;

            default:
                return;
        }

        stat.save();
        printPoints(message, points);
    }
    catch (err) {
        logger.log('error', err);
        return;
    }

});
*/

//Checking for reactions
client.on('messageReactionAdd', async (reaction, user) => {

    if (reaction.partial) {

        try {
            await reaction.fetch();
        }
        catch (error) {
            logger.log('error', `Something went wrong when fetching the message: ${error}`);
            return;
        }
    }

    if (user.partial) {

        try {
            await user.fetch();

        }
        catch (error) {
            logger.log('error', `Something went wrong when fetching the user: ${error}`);
            return;
        }
    }

    //Only the founders and the head pupil can add points to houses.
    const guildMember = reaction.message.guild.members.cache.get(user.id);
    if (!guildMember) {
        return;
    }
    const adminRole = guildMember.roles.cache.has(configs.admin_role_id);
    const headRole = guildMember.roles.cache.has(configs.head_pupil_id);

    if (adminRole === false && headRole === false) {
        return;
    }

    let pointsToAdd = {
        gryffindor: 0,
        slytherin: 0,
        ravenclaw: 0,
        hufflepuff: 0
    };

    const emoji = reaction.emoji.toString();
    reaction.message.member.roles.cache.find(role => {
        if (role.id === configs.gryffindor_role) {
            if (emoji === configs.emoji_addpoints) {
                pointsToAdd.gryffindor += 10;
            }
            else if (emoji === configs.emoji_removepoints) {
                pointsToAdd.gryffindor -= 10;
            }
            return true;
        }
        else if (role.id === configs.slytherin_role) {
            if (emoji === configs.emoji_addpoints) {
                pointsToAdd.slytherin += 10;
            }
            else if (emoji === configs.emoji_removepoints) {
                pointsToAdd.slytherin -= 10;
            }
            return true;
        }
        else if (role.id === configs.ravenclaw_role) {
            if (emoji === configs.emoji_addpoints) {
                pointsToAdd.ravenclaw += 10;
            }
            else if (emoji === configs.emoji_removepoints) {
                pointsToAdd.ravenclaw -= 10;
            }
            return true;
        }
        else if (role.id === configs.hufflepuff_role) {
            if (emoji === configs.emoji_addpoints) {
                pointsToAdd.hufflepuff += 10;
            }
            else if (emoji === configs.emoji_removepoints) {
                pointsToAdd.hufflepuff -= 10;
            }
            return true;
        }
        return false;

    });

    //Return if there is no points to add, this is a sanity check, in the usual mode, this wouldn't be a problem
    if (pointsToAdd.gryffindor === 0 && pointsToAdd.slytherin === 0 && pointsToAdd.ravenclaw === 0 && pointsToAdd.hufflepuff === 0) return;

    Stat.findById(configs.stats_id).then(stat => {

        let points = stat.points[stat.points.length - 1];

        points.gryffindor += pointsToAdd.gryffindor;
        if (points.gryffindor <= 0) points.gryffindor = 0;
        points.ravenclaw += pointsToAdd.ravenclaw;
        if (points.ravenclaw <= 0) points.ravenclaw = 0;
        points.slytherin += pointsToAdd.slytherin;
        if (points.slytherin <= 0) points.slytherin = 0;
        points.hufflepuff += pointsToAdd.hufflepuff;
        if (points.hufflepuff <= 0) points.hufflepuff = 0;

        stat
            .save()
            .then(() => {
                logger.log('info', 'Points saved!');

            })
            .catch(err => logger.log('error', err));

        printPoints(reaction.message, points);

    });

});

//Listening to lightningbolts
client.on('message', async message => {
    if (!message.content.startsWith('⚡')) return;

    const currentTime = Date.now();
    Stat.findById(configs.stats_id).then(stat => {

        if (stat.lightnings.length > 0) {
            const lastRecordingDate = stat.lightnings[stat.lightnings.length - 1].date;
            let elapsedTime = Math.abs(currentTime - lastRecordingDate);
            elapsedTime = elapsedTime / 1000;
            elapsedTime = elapsedTime / 60;
            elapsedTime = elapsedTime / 60;

            if (elapsedTime > parseInt(configs.recording_delay)) {
                stat.lightnings = [];
            }
        }

        const question = {
            member: message.member.id,
            question: message.content,
            recording_date: currentTime
        };

        stat.lightnings.push(question);
        stat
            .save()
            .then(() => {
                logger.log('info', `lightning bolt question saved!`);
                message.reply(`Your lightning bolt question was saved!`);
            })
            .catch(err => logger.log('error', err));

    }).catch(err => logger.log('error', err));

});

//Responding to DMs
client.on('message', message => {
    if (message.channel.type !== 'dm' || message.author.id === client.user.id) return;
    client.users.fetch(configs.vini_id)
        .then(user => {
            message.reply(`If you have any questions relating to how the bot works, please feel free to DM ${user} :smile:`);
        })
        .catch(err => logger.log('error', err));
});

//General commands given to the bot
client.on('message', message => {

    //Ignores all messages and commands send to the bot from DM
    if (!message.guild) return;

    //const prefix = message.guild.emojis.cache.find(emoji => emoji.name === command_prefix).toString();
    if (!message.content.startsWith(command_prefix) || message.author.bot) return;

    const args = message.content.slice(command_prefix.length).split(/ +/);
    args.shift();
    let commandName = args.shift();
    if (!commandName) return;
    commandName = commandName.toLowerCase();

    if (!client.commands.has(commandName)) {
        logger.log('warn', `Couldn't find the command ${commandName}`);
        return;
    }

    const command = client.commands.get(commandName);
    const isAdminRole = message.member.roles.cache.has(configs.admin_role_id);
    const isITRole = message.member.roles.cache.has(configs.hogwarts_IT_id);

    if (command.admin && (isAdminRole === false && isITRole === false)) {
        logger.log('warn', `${message.author} does not have the necessary role to execute this command. The necessary role is ${configs.admin_role_id}`);
        return;
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);

    if ((command.args && !args.length) || (command.attachments && message.attachments.size === 0)) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${command_prefix}${command.name} ${command.usage}\``;
        }
        return message.member.createDM()
            .then(channel => {
                channel.send(reply)
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    }

    if (command.attachments && message.attachments.size === 0) {
        let reply = `You didn't provide any attachment, ${message.author}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${command_prefix}${command.name} ${command.usage}\``;
        }
        return message.member.createDM()
            .then(channel => {
                channel.send(reply)
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    }
    else if (command.attachments && message.attachments.size > 0) {
        if (message.attachments.first().width > command.attachment_size || message.attachments.first().height > command.attachment_size) {
            return message.member.createDM()
                .then(channel => {
                    channel.send(`${message.author} the patronus image must be smaller than ${command.attachment_size}x${command.attachment_size}!`)
                        .catch(err => console.error(err));
                })
                .catch(err => console.error(err));
        }
    }

    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            logger.log('info', timeLeft);
            return message.member.createDM()
                .then(channel => {
                    channel.send(`Hello ${message.author} please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                        .catch(err => console.error(err));
                })
                .catch(err => console.error(err));
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, logger);
    } catch (error) {
        console.error(error);
        message.member.createDM()
            .then(channel => {
                channel.send('there was an error trying to execute that command!')
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    }


    logger.log('info', message.content);
});

async function printPoints(message, points) {
    //Delete the previous message
    const hourglass_channel = message.guild.channels.cache.get(configs.house_points_channel);
    if (hourglass_channel) {
        hourglass_channel.bulkDelete(4)
            .then(messages => {
                logger.log('info', `Bulk deleted ${messages.size} messages`);
            })
            .catch(console.error);
    }
    else {
        logger.log('error', 'Couldn\'t find the hourglass channel, check Id');
        return;
    }

    let houses = [{
        name: 'Gryffindor 🦁',
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
        name: 'Hufflepuff 🦡',
        points: points.hufflepuff
    }
    ];

    houses.sort((a, b) => b.points - a.points);
    let reply = '**House Points**\n\n';

    houses.forEach(house => {
        reply += `${house.name} with a total of **${house.points}!**\n\n`;
    });

    return hourglass_channel.send(reply);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

process.on('uncaughtException', error => logger.log('error', error));

client.login(token);
