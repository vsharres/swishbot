import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { MessageAttachment, Message, TextChannel } from 'discord.js';
import { printPoints } from '../tools/print_points';
import { Logger } from 'winston';
import { Command } from './command';

export class Snape extends Command {

    constructor() {
        super(["snape", "megans_favorite_teacher"], '', 10, '<house> <points>', true, true);
    }

    async execute(message: Message, args: string[], logger: Logger) {

        if (args.length !== 2 || isNaN(parseFloat(args[1]))) {
            return message.channel.send(`${message.author.toString()} the proper usage would be: ${Configs.command_prefix} \`${this.names} ${this.usage}\``)
                .catch(err => logger.log('error', err));
        }

        const guild = message.guild;
        if (!guild) return;
        const hourglass_channel = <TextChannel>guild.channels.cache.get(Configs.channel_house_points);

        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                logger.log('error', 'Error to get the stats, check the id');
                return;
            }

            let points = stat.points;

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
            let content: string;

            switch (house) {
                case 'gryffindor':
                    points.gryffindor -= amount;
                    if (points.gryffindor <= 0) points.gryffindor = 0;
                    content = `Snape removes ${amount} from **${name} points**\n`
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
                    content = `Snape removes ${amount} from **${name} points**\n`
                    break;
                case 'hufflepuff':
                    points.hufflepuff -= amount;
                    if (points.hufflepuff <= 0) points.hufflepuff = 0;
                    name = 'Hufflepuff 🦡';
                    content = `Snape removes ${amount} from **${name} points**\n`
                    break;
                default:
                    points.gryffindor -= amount;
                    if (points.gryffindor <= 0) points.gryffindor = 0;
                    content = `Snape removes ${amount} from **${name} points**\n`
                    break;
            }

            stat.points = points;

            stat
                .save()
                .then(() => {
                    message.channel
                        .send({
                            content: content,
                            files: [new MessageAttachment(Configs.emoji_snape)]
                        })
                        .catch(err => logger.log('error', err));
                })
                .catch(err => logger.log('error', err));

            printPoints(hourglass_channel, points, logger, true);
        })
            .catch(err => logger.log('error', err));
    }
};

export default new Snape();