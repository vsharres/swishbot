import { Configs } from '../config/configs';
import { Message } from 'discord.js';
import { Logger } from 'winston';
import { Command } from './command';

export class Flu extends Command {

    constructor() {
        super(["flu"], 'Sends a message to all discord members', 1, '<Roles to Exclude>');
    }

    async execute(message: Message, args: string[], logger: Logger) {

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
                                channel.send(``)
                                    .catch(err => logger.log('error', err));
                            })
                            .catch(err => logger.log('error', err));
                    }
                });
            })
            .catch(err => logger.log('error', err));

    }
};

export default new Flu();
