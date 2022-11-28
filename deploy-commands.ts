import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { Configs } from "./config/configs";
import fs from 'node:fs';
import path from 'node:path';
import { Command } from "./bot-types";

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const data = require(filePath).JsonData;
    commands.push(data);
}

const rest = new REST({ version: '10' }).setToken(Configs.token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data: any = await rest.put(
            Routes.applicationGuildCommands(Configs.client_id, Configs.guild_id),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();