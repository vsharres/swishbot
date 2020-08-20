import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { MessageAttachment, Message } from 'discord.js';
import { printPoints } from '../tools/print_points';
import { Logger } from 'winston';
import { Command } from './command';

export class Dumbly extends Command {

    constructor() {
        super("dumbly", '', 10, '<house> <points>', true, true);
    }

    async execute(message: Message, args: string[], logger: Logger) {

        if (args.length !== 2 || isNaN(parseFloat(args[1]))) {
            return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.name} ${this.usage}\``)
                .catch(err => logger.log('error', err));
        }

        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                logger.log('error', 'Error to get the stats, check the id');
                return;
            }

            let points = stat.points[stat.points.length - 1];

            let parsed = args.shift();
            if (!parsed) {
                logger.log('error', 'Error shifting the house.');
                return;
            }
            let house = parsed;

            parsed = args.shift();
            if (!parsed) {
                logger.log('error', 'Error shifting the amount.');
                return;
            }
            const amount = parseFloat(parsed);

            house = house.toLowerCase();
            let name = 'Gryffindor 🦁';

            switch (house) {
                case 'gryffindor':
                    points.gryffindor += amount;
                    break;
                case 'slytherin':
                    points.slytherin += amount;
                    name = 'Slytherin 🐍';
                    break;
                case 'ravenclaw':
                    points.ravenclaw += amount;
                    name = 'Ravenclaw 🦅';
                    break;
                case 'hufflepuff':
                    points.hufflepuff += amount;
                    name = 'Hufflepuff 🦡';
                    break;
                default:
                    points.gryffindor += amount;
                    break;
            }

            stat.points[stat.points.length - 1] = points;

            stat
                .save()
                .then(() => {
                    message.channel
                        .send({
                            content: `Dumbly awards ${name} with **${amount} points!**\n`,
                            files: [new MessageAttachment(Configs.dumbly_emoji)]
                        })
                        .catch(err => logger.log('error', err));
                })
                .catch(err => logger.log('error', err));

            printPoints(message, points, logger);
        })
            .catch(err => logger.log('error', err));
    }
};

export default new Dumbly();