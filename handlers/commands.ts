import { Client, Collection } from 'discord.js';
import { Logger } from 'winston';
import fs from 'fs';
import { Handler } from './handler';
import { Configs } from '../config/configs';
import { Command } from '../commands/command';

export class Commands extends Handler {

    constructor(client: Client, logger: Logger) {
        super('command', 'handler to get all of the commands to the bot', client, logger);
    }

    async On() {
        const client = this.client;
        const logger = this.logger;

        const commands = new Collection<string, Command>();
        const cooldowns = new Collection<string, Collection<string, number>>();
        let commandFiles: string[];

        if (process.env.NODE_ENV === "production") {
            commandFiles = fs.readdirSync('./build/commands').filter(file => !file.includes('command'));
        } else {
            commandFiles = fs.readdirSync('./commands').filter(file => !file.includes('command'));
        }

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`)
            const names = command.default.names;

            names.forEach((name: string) => {
                commands.set(name, command.default);
            });
        }


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

            if (!cooldowns.has(commandName)) {
                cooldowns.set(commandName, new Collection<string, number>());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(commandName);
            if (!timestamps) {
                logger.log('error', `Error at getting the time stamps`);
                return;
            }

            if ((command.args && !args.length) || (command.attachments && message.attachments.size === 0)) {
                let reply = `You didn't provide any arguments, ${message.author.toString()}!`;
                if (command.usage) {
                    reply += `\nThe proper usage would be: \`${Configs.command_prefix}${commandName} ${command.usage}\``;
                }
                return member.createDM()
                    .then(channel => {
                        channel.send(reply)
                            .catch(err => logger.error(err));
                    })
                    .catch(err => logger.error(err));
            }

            if (command.attachments && message.attachments.size === 0) {
                let reply = `You didn't provide any attachment, ${message.author.toString()}!`;
                if (command.usage) {
                    reply += `\nThe proper usage would be: \`${Configs.command_prefix}${commandName} ${command.usage}\``;
                }
                return member.createDM()
                    .then(channel => {
                        channel.send(reply)
                            .catch(err => logger.error(err));
                    })
                    .catch(err => logger.error(err));
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
                            channel.send(`Hello ${message.author.toString()} please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`)
                                .catch(err => logger.error(err));
                        })
                        .catch(err => logger.error(err));
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            try {
                command.execute(message, args, logger);
            } catch (error) {
                logger.error(error);
                member.createDM()
                    .then(channel => {
                        channel.send('there was an error trying to execute that command!')
                            .catch(err => logger.error(err));
                    })
                    .catch(err => logger.error(err));
            }


            logger.log('info', message.content);
        });


    }

};