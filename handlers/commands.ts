import { Collection, Message } from 'discord.js';
import logger from '../tools/logger';
import profiler from '../tools/profiler';
import fs from 'fs';
import { Handler } from './handler';
import { Configs } from '../config/configs';
import { Command } from '../commands/command';

export class Commands extends Handler {

    commandFiles: String[];
    commands: Collection<string, Command>;
    cooldowns: Collection<string, Collection<string, number>>;

    constructor() {
        super('command', true);
        this.commandFiles = [];
        this.commands = new Collection<string, Command>();
        this.cooldowns = new Collection<string, Collection<string, number>>();

        if (process.env.NODE_ENV === "production") {
            this.commandFiles = fs.readdirSync('./build/commands').filter(file => !file.includes('command'));
        } else {
            this.commandFiles = fs.readdirSync('./commands').filter(file => !file.includes('command'));
        }

        for (const file of this.commandFiles) {
            const command = require(`../commands/${file}`)
            const names = command.default.names;

            names.forEach((name: string) => {
                this.commands.set(name, command.default);
            });
        }
    }

    async OnMessage(message: Message) {
        const commands = this.commands;

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

        const command = commands.get(commandName);
        if (!command) {
            return;
        }

        const isAdminRole = member.roles.cache.has(Configs.role_admin);
        const isITRole = member.roles.cache.has(Configs.role_IT);

        if (command.admin && (isAdminRole === false && isITRole === false)) {
            logger.log('warn', `${message.author.toString()} does not have the necessary role to execute this command. The necessary role is ${Configs.role_admin}`);
            return;
        }

        const prefectRole = member.roles.cache.has(Configs.role_prefect)
        if (command.prefect && (prefectRole === false && isAdminRole === false && isITRole === false)) {
            logger.log('warn', `${message.author.toString()} does not have the necessary role to execute this command. The necessary role is ${Configs.role_prefect}`);
            return;
        }

        profiler.startTimer(commandName);
        command.execute(message, args).then((value) => {
            if (commandName) {
                logger.log('info', `[${commandName}]: time to execute: ${profiler.endTimer(commandName)} ms`);
            }
        })
            .catch(error => {
                logger.error(error);
                member.createDM()
                    .then(channel => {
                        channel.send('there was an error trying to execute that command!')
                            .catch(err => logger.error(err));
                    })
                    .catch(err => logger.error(err));
            });

    }

};

export default new Commands();