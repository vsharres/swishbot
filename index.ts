import { Events, GuildMember, Message, MessageReaction, User, Partials, GatewayIntentBits, PartialMessage, PartialGuildMember, PartialMessageReaction, PartialUser } from 'discord.js';
import mongoose from 'mongoose';
import { BotClient, Command } from './bot-types';
import { Configs } from './config/configs';
import { Events as BotEvents } from './events';
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
    logger.log('info', 'Ready!');

    const events = new BotEvents(client);

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath).default(client) as Command;

        client.Commands.set(command.name, command);
    }
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
