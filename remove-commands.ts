import { REST, Routes } from "discord.js";
import { Configs } from "./config/configs";
import fs from 'node:fs';
import path from 'node:path';

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const data = require(filePath).JsonData;
    commands.push(data);
}

const rest = new REST({ version: '10' }).setToken(Configs.token);

// for guild-based commands
rest.delete(Routes.applicationGuildCommand(Configs.client_id, Configs.guild_id, 'commandId'))
    .then(() => console.log('Successfully deleted guild command'))
    .catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(Configs.client_id, 'commandId'))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);