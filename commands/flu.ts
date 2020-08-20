import { Configs } from '../config/configs';
import { Message } from 'discord.js';
import { Logger } from 'winston';
import { Command } from './command';

export class Flu extends Command {

    constructor() {
        super("flu", 'Sends a message to all discord members', 1, '<Roles to Exclude>');
    }

    async execute(message: Message, args: string[], logger: Logger) {

        if (message.author.id !== Configs.vini_id && message.author.id !== Configs.marchismo_id && message.author.id !== Configs.mia_id && message.author.id !== Configs.brandon_id) return;

        args.push('Bot');
        args.push('Founders');
        args.push('Hogwarts Ghosts');

        const guild = message.guild;

        if (!guild) {
            return logger.log('error', 'Error getting the guild, check the id');
        }

        guild.members.fetch()
            .then(members => {
                members.forEach(member => {
                    let roles = member.roles.cache.find(role => args.includes(role.name));

                    if (!roles) {
                        member.createDM()
                            .then(channel => {
                                channel.send(`Hello Swisher!\n\nJust a reminder, we are planning a surprise thank you gift to the hosts of Swish and Flick on their anniversary. We thought it would be fun to all leave messages on what they mean to us!\n\nWe have had some hiccups with the google form we are using to collect answers. If you run into an issue where the form isn't working OR you need to edit or resubmit your response please privately direct message: ${members.get(Configs.mia_id)} ${members.get(Configs.marchismo_id)} ${members.get(Configs.brandon_id)} or ${members.get(Configs.vini_id)}.\n\nIf you want to participate, click the link below. Don't forget this is supposed to be a **SURPRISE**, __please don't discuss in the general discord chat__. The deadline for submitting a message is **July 15th!**\n\nhttps://forms.gle/2EZRaUJQsymPHgEZ8`)
                                    .catch(err => logger.log('error', err));
                            })
                            .catch(err => logger.log('error', err));
                    }
                });
            })
            .catch(err => logger.log('error', err));

    }
};

export default new Flu()
