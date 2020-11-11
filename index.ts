import Discord, { TextChannel } from 'discord.js';
import mongoose from 'mongoose';
import { Configs } from './config/configs';
import winston from 'winston';
import { Zaps } from './handlers/zaps';
import { Points } from './handlers/points';
import { Handler } from './handlers/handler';
import { Commands } from './handlers/commands';
import { Kicks } from './handlers/kicks';
import { Votes } from './handlers/votes';
import { Likes } from './handlers/likes';
import Stat from './models/Stat';
import { printPoints } from './tools/print_points';

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

const client = new Discord.Client({ partials: ['REACTION', 'MESSAGE'] });
const handlers = new Discord.Collection<string, Handler>();

handlers.set('zap', new Zaps(client, logger));
//handlers.set('points', new Points(client, logger));
handlers.set('commands', new Commands(client, logger));
//handlers.set('votes', new Votes(client, logger));
handlers.set('kicks', new Kicks(client, logger));
//handlers.set('likes', new Likes(client, logger));

handlers.forEach(handler => {
    handler.On();
});

client.once('ready', () => {
    logger.log('info', 'Ready!');

});

//NEED TO CHANGE THAT
//Checking for reactions
client.on('messageReactionAdd', async (reaction, user) => {

    if (reaction.partial) {

        try {
            reaction = await reaction.fetch();
        }
        catch (error) {
            logger.log('error', `[${''}]: Something went wrong when fetching the message: ${error}`);
            return;
        }
    }

    if (user.partial) {

        try {
            user = await user.fetch();

        }
        catch (error) {
            logger.log('error', `[${''}]: Something went wrong when fetching the user: ${error}`);
            return;
        }
    }

    //No reactions on your own message or no points given to a bot message
    if (reaction.message.author.id === user.id || reaction.message.author.bot) {
        return;
    }

    //Only the founderscan add points to houses.
    const guild = reaction.message.guild;
    if (!guild) {
        logger.log('error', `[${''}]: Error getting the guild of the reaction`);
        return;
    }
    const admin_member = await guild.members.fetch(user.id);
    const guild_member = await guild.members.fetch(reaction.message.author.id);

    if (!guild_member) {
        logger.log('error', `[${''}]: Error getting the guildmember`);
        return;
    }
    const adminRole = admin_member.roles.cache.has(Configs.role_admin);

    if (adminRole === false) {
        return;
    }

    let points = 0;

    const emoji = reaction.emoji.toString();
    if (Configs.emoji_addpoints.some((addpoint) => addpoint === emoji)) {
        points = 1;
    }
    else if (Configs.emoji_removepoints.some((removepoint) => removepoint === emoji)) {
        points = -1;
    }
    else {
        return;
    }

    let pointsToAdd = {
        gryffindor: 0,
        slytherin: 0,
        ravenclaw: 0,
        hufflepuff: 0
    };
    const memberRoles = guild_member.roles.cache;

    if (memberRoles.has(Configs.role_gryffindor)) {
        points *= Configs.gryffindor_points_multiplier;
        pointsToAdd.gryffindor += points;
    }
    else if (memberRoles.has(Configs.role_slytherin)) {
        points *= Configs.slytherin_points_multiplier;
        pointsToAdd.slytherin += points;
    }
    else if (memberRoles.has(Configs.role_ravenclaw)) {
        points *= Configs.ravenclaw_points_multiplier;
        pointsToAdd.ravenclaw += points;
    }
    else if (memberRoles.has(Configs.role_hufflepuff)) {
        points *= Configs.hufflepuff_points_multiplier;
        pointsToAdd.hufflepuff += points;
    }
    else {
        return;
    }

    Stat.findById(Configs.stats_id).then((stat) => {
        if (!stat) {
            return;
        }

        let points = stat.points;
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
                logger.log('info', `[${''}]: Points modified by: gryffindor:${pointsToAdd.gryffindor} slytherin:${pointsToAdd.slytherin} ravenclaw:${pointsToAdd.ravenclaw} hufflepuff:${pointsToAdd.hufflepuff}`);

            })
            .catch(err => logger.log('error', `[${''}]: ${err}`));

        const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);
        printPoints(hourglass_channel, points, logger, true);

    });

});

process.on('uncaughtException', error => logger.log('error', error));

process.on('unhandledRejection', error => {
    logger.log('error', error);
});

client.login(Configs.token);
