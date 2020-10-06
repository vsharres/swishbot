import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, TextChannel } from 'discord.js';
import { Logger } from 'winston';
import { Command } from './command';
import { printcups } from '../tools/print_cups';

export class Award extends Command {

    constructor() {
        super(["award_cup"], 'Award the house cup for the recording', 60, '<house>', true, true);
    }

    async execute(message: Message, args: string[], logger: Logger) {

        if (args.length !== 1 || !isNaN(parseFloat(args[0]))) {
            return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``)
                .catch(err => logger.log('error', err));
        }

        const guild = message.guild;
        if (!guild) {
            logger.log('error', 'Couldn\'t find the server.');
            return;
        }

        const trophy_channel = <TextChannel>guild.channels.cache.get(Configs.channel_trophy_room);
        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                logger.log('error', 'Error to get the stats, check the id');
                return;
            }

            let house = args.shift();
            if (!house) {
                logger.log('error', 'Error shifting the house.');
                return;
            }
            house = house.toLowerCase();

            let name = 'Gryffindor 🦁';
            let cups = stat.house_cups;

            switch (house) {
                case 'gryffindor':
                    cups.gryffindor++;
                    break;
                case 'slytherin':
                    cups.slytherin++;
                    name = 'Slytherin 🐍';
                    break;
                case 'ravenclaw':
                    cups.ravenclaw++;
                    name = 'Ravenclaw 🦅';
                    break;
                case 'hufflepuff':
                    cups.hufflepuff++;
                    name = 'Hufflepuff 🦡';
                    break;
                default:
                    return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``)
                        .then(() => logger.log('log', `${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``))
                        .catch(err => logger.log('error', err));
            }

            stat.house_cups = cups;

            printcups(trophy_channel, cups, logger, true);

            stat
                .save()
                .then(() => {
                    message.channel
                        .send(`The house cup for this recording goes to **${name}!** \n`)
                        .then(() => logger.log('log', `The house cup for this recording goes to **${name}!** \n`))
                        .catch(err => logger.log('error', err));
                })
                .catch(err => logger.log('error', err));



        })
            .catch(err => logger.log('error', err));
    }
};

export default new Award();