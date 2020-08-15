const Discord = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const { command_prefix, token } = require('./config/configs');
const configs = require('./config/configs');
const winston = require('winston');
const db = require('./config/configs').mongoURI;
const printer = require('./tools/print_points');

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

        printer.printPoints(reaction.message, points, logger);

    });

});

//Listening to lightningbolts
client.on('message', async message => {
    if (!message.content.startsWith('⚡')) return;

    const currentTime = Date.now();
    Stat.findById(configs.stats_id).then(stat => {

        const question = {
            member: message.member.id,
            question: message.content,
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

//General commands given to the bot
client.on('message', message => {

    //Ignores all messages and commands send to the bot from DM
    if (!message.guild) return;

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

    const isDMChannel = message.channel.type === 'dm';
    const command = client.commands.get(commandName);
    const isAdminRole = message.member.roles.cache.has(configs.admin_role_id);
    const isITRole = message.member.roles.cache.has(configs.hogwarts_IT_id);

    if (command.dm && !isDMChannel) {
        logger.log('warn', `The command can only be executed as a DM to the bot`);
        return;
    }

    if (command.admin && (isAdminRole === false && isITRole === false)) {
        logger.log('warn', `${message.author} does not have the necessary role to execute this command. The necessary role is ${configs.admin_role_id}`);
        return;
    }

    const headRole = message.member.roles.cache.has(configs.head_pupil_id);
    if (command.head_pupil && (headRole === false && isAdminRole === false && isITRole === false)) {
        logger.log('warn', `${message.author} does not have the necessary role to execute this command. The necessary role is ${configs.head_pupil_id}`);
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

process.on('uncaughtException', error => logger.log('error', error));

client.login(token);
