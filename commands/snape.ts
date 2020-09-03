import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { MessageAttachment, Message } from 'discord.js';
import { printPoints } from '../tools/print_points';
import { Logger } from 'winston';
import { Command } from './command';

export class Snape extends Command {

    constructor() {
        super("snape", '', 10, '<house> <points>', true, true);
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
            let content = `Snape removes ${amount} from **${name} points**\n`;

            switch (house) {
                case 'gryffindor':
                    points.gryffindor -= amount;
                    if (points.gryffindor <= 0) points.gryffindor = 0;
                    break;
                case 'slytherin':
                    points.slytherin += amount;
                    name = 'Slytherin 🐍';
                    content = `Snape awards (**Obviously**) ${name} with **${amount} points!**\n`
                    break;
                case 'ravenclaw':
                    points.ravenclaw -= amount;
                    if (points.ravenclaw <= 0) points.ravenclaw = 0;
                    name = 'Ravenclaw 🦅';
                    break;
                case 'hufflepuff':
                    points.hufflepuff -= amount;
                    if (points.hufflepuff <= 0) points.hufflepuff = 0;
                    name = 'Hufflepuff 🦡';
                    break;
                default:
                    points.gryffindor -= amount;
                    if (points.gryffindor <= 0) points.gryffindor = 0;
                    break;
            }

            stat.points[stat.points.length - 1] = points;
            const cups = stat.house_cups;

            stat
                .save()
                .then(() => {
                    message.channel
                        .send({
                            content: content,
                            files: [new MessageAttachment(Configs.snape_emoji)]
                        })
                        .catch(err => logger.log('error', err));
                })
                .catch(err => logger.log('error', err));

            printPoints(message, points, cups, logger);
        })
            .catch(err => logger.log('error', err));
    }
};

export default new Snape();