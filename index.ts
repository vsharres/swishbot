import { Events, Partials, GatewayIntentBits } from 'discord.js';
import mongoose from 'mongoose';
import { BotClient, BotEvent, Command } from './bot-types';
import { Configs } from './config/configs';
import logger from './tools/logger';
import fs from 'fs';
import path from 'node:path';

mongoose
    .connect(
        Configs.mongoURI
    )
    .then(() => logger.log('info', 'MongoDB Connected'))
    .catch(err => logger.log('error', err));

const client = new BotClient({
    partials: [Partials.Reaction, Partials.Message, Partials.User, Partials.GuildMember],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady, () => {
    logger.log('info', '[INDEX]: Ready!');

    const eventsPath = path.join(__dirname, 'events');
    const handler_files = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of handler_files) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath).default(client) as BotEvent;
        if (event.on) {
            client.on(event.type, (...args) => event.execute(...args));
        }
        else if (event.once) {
            client.once(event.type, (...args) => event.execute(...args));
        }

    }

    logger.log('info', `[INDEX]: ${handler_files.length} Events succesfully loaded.`);

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath).default(client) as Command;

        client.Commands.set(command.name, command);
    }

    logger.log('info', `[INDEX]: ${commandFiles.length} Commands succesfully loaded.`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as BotClient).Commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

process.on('uncaughtException', error => logger.log('error', error));

process.on('unhandledRejection', error => {
    logger.log('error', error);
});

client.login(Configs.token);
