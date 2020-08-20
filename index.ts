import Discord from 'discord.js';
import mongoose from 'mongoose';
import fs from 'fs';
import { Configs } from './config/configs';
import winston from 'winston';
import { printPoints } from './tools/print_points';
import Stat from './models/Stat';
import { Command } from './commands/command';
import Countdown from './commands/countdown';
import Devitos from './commands/devitos';
import Dumbly from './commands/dumbledore';
import Flue from './commands/flu';
import Lightning from './commands/lightning';
import Points from './commands/points';
import ResetPoints from './commands/points_reset';
import Recording from './commands/recording';

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log' }),
    ],
    format: winston.format.printf((log: any) => `[${log.level.toUpperCase()}] - ${log.message}`),
});

mongoose
    .connect(
        Configs.mongoURI,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    )
    .then(() => logger.log('info', 'MongoDB Connected'))
    .catch(err => logger.log('error', err));

//import("./commands/devitos").then(command => logger.log('info', "devitos"));

const client = new Discord.Client({ partials: ['REACTION', 'MESSAGE'] });

const commands = new Discord.Collection<string, Command>();
const cooldowns = new Discord.Collection<string, Discord.Collection<string, number>>();

//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts') && !file.endsWith('command.ts'));

commands.set(Countdown.name, Countdown);
commands.set(Devitos.name, Devitos);
commands.set(Dumbly.name, Dumbly);
commands.set(Flue.name, Flue);
commands.set(Lightning.name, Lightning);
commands.set(Points.name, Points);
commands.set(ResetPoints.name, ResetPoints);
commands.set(Recording.name, Recording);


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

    //Only the founders and the head pupil can add points to houses. The head pupil can't give points to itself.
    const guild = reaction.message.guild;
    if (!guild) {
        logger.log('error', `error getting the guild of the reaction`);
        return;
    }
    const guildMember = guild.members.cache.get(user.id);

    //No reactions on your own message
    if (reaction.message.author.id === user.id) {
        return;
    }

    if (!guildMember) {
        logger.log('error', `error getting the guildmemers`);
        return;
    }
    const adminRole = guildMember.roles.cache.has(Configs.admin_role_id);
    const headRole = guildMember.roles.cache.has(Configs.head_pupil_id);

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

    const member = reaction.message.member;
    if (!member) {
        return;
    }

    member.roles.cache.find(role => {
        if (role.id === Configs.gryffindor_role) {
            if (emoji === Configs.emoji_addpoints) {
                pointsToAdd.gryffindor += 10;
            }
            else if (emoji === Configs.emoji_removepoints) {
                pointsToAdd.gryffindor -= 10;
            }
            return true;
        }
        else if (role.id === Configs.slytherin_role) {
            if (emoji === Configs.emoji_addpoints) {
                pointsToAdd.slytherin += 10;
            }
            else if (emoji === Configs.emoji_removepoints) {
                pointsToAdd.slytherin -= 10;
            }
            return true;
        }
        else if (role.id === Configs.ravenclaw_role) {
            if (emoji === Configs.emoji_addpoints) {
                pointsToAdd.ravenclaw += 10;
            }
            else if (emoji === Configs.emoji_removepoints) {
                pointsToAdd.ravenclaw -= 10;
            }
            return true;
        }
        else if (role.id === Configs.hufflepuff_role) {
            if (emoji === Configs.emoji_addpoints) {
                pointsToAdd.hufflepuff += 10;
            }
            else if (emoji === Configs.emoji_removepoints) {
                pointsToAdd.hufflepuff -= 10;
            }
            return true;
        }
        return false;

    });

    //Return if there is no points to add, this is a sanity check, in the usual mode, this wouldn't be a problem
    if (pointsToAdd.gryffindor === 0 && pointsToAdd.slytherin === 0 && pointsToAdd.ravenclaw === 0 && pointsToAdd.hufflepuff === 0) return;

    Stat.findById(Configs.stats_id).then((stat) => {
        if (!stat) {
            return;
        }

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

        printPoints(reaction.message, points, logger);

    });

});

//Listening to lightningbolts
client.on('message', async message => {
    if (!message.content.startsWith('⚡')) return;

    Stat.findById(Configs.stats_id).then((stat) => {

        if (!stat) {
            return;
        }

        const question = {
            member: message.author.id,
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
client.on('message', async message => {

    //Ignores all messages and commands send to the bot from DM
    if (!message.guild) return;

    if (!message.content.startsWith(Configs.command_prefix) || message.author.bot) return;

    const args = message.content.slice(Configs.command_prefix.length).split(/ +/);
    args.shift();
    let commandName = args.shift();
    if (!commandName) return;
    commandName = commandName.toLowerCase();

    if (!commands.has(commandName)) {
        logger.log('warn', `Couldn't find the command ${commandName}`);
        return;
    }

    const member = message.member;
    if (!member) {
        return;
    }

    const isDMChannel = message.channel.type === 'dm';
    const command = commands.get(commandName);
    if (!command) {
        return;
    }
    const isAdminRole = member.roles.cache.has(Configs.admin_role_id);
    const isITRole = member.roles.cache.has(Configs.hogwarts_IT_id);

    if (command.admin && (isAdminRole === false && isITRole === false)) {
        logger.log('warn', `${message.author.toString()} does not have the necessary role to execute this command. The necessary role is ${Configs.admin_role_id}`);
        return;
    }

    const headRole = member.roles.cache.has(Configs.head_pupil_id);
    if (command.head_pupil && (headRole === false && isAdminRole === false && isITRole === false)) {
        logger.log('warn', `${message.author.toString()} does not have the necessary role to execute this command. The necessary role is ${Configs.head_pupil_id}`);
        return;
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection<string, number>());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    if (!timestamps) {
        logger.log('error', `Error at getting the time stamps`);
        return;
    }

    if ((command.args && !args.length) || (command.attachments && message.attachments.size === 0)) {
        let reply = `You didn't provide any arguments, ${message.author.toString()}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${Configs.command_prefix}${command.name} ${command.usage}\``;
        }
        return member.createDM()
            .then(channel => {
                channel.send(reply)
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    }

    if (command.attachments && message.attachments.size === 0) {
        let reply = `You didn't provide any attachment, ${message.author.toString()}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${Configs.command_prefix}${command.name} ${command.usage}\``;
        }
        return member.createDM()
            .then(channel => {
                channel.send(reply)
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    }
    else if (command.attachments && message.attachments.size > 0) {
        const attachments = message.attachments;
        if (!attachments) {
            return;
        }
        const attachment = attachments.first();
        if (!attachment) {
            return;
        }

        /** 
        if (attachment.width ? attachment.width : 0 > command.attachment_size ||
            attachment.height ? attachment.height : 0 > command.attachment_size) {
            return member.createDM()
                .then(channel => {
                    channel.send(`${message.author.toString()} the attached image must be smaller than ${command.attachment_size}x${command.attachment_size}!`)
                        .catch(err => console.error(err));
                })
                .catch(err => console.error(err));
        }
        */
    }

    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const author_timestamp = timestamps.get(message.author.id);
        if (!author_timestamp) {
            return;
        }

        const expirationTime = author_timestamp + cooldownAmount;

        if (now < expirationTime && !isAdminRole) {
            const timeLeft = (expirationTime - now) / 1000;
            logger.log('info', timeLeft);
            return member.createDM()
                .then(channel => {
                    channel.send(`Hello ${message.author.toString()} please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
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
        member.createDM()
            .then(channel => {
                channel.send('there was an error trying to execute that command!')
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    }


    logger.log('info', message.content);
});

process.on('uncaughtException', error => logger.log('error', error));

process.on('unhandledRejection', error => {
    logger.log('error', error);
});

client.login(Configs.token);
