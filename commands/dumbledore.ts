import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { MessageAttachment, Message, TextChannel } from 'discord.js';
import { printPoints } from '../tools/print_points';
import { Logger } from 'winston';
import { Command } from './command';

export class Dumbly extends Command {

    constructor() {
        super(["dumbly", "dumbledore", "🦁", "🐍", "🦅", "🦡"], '', 10, '<house> <points>', true, true, true);
    }

    async execute(message: Message, args: string[], logger: Logger) {

        if (args.length == 2 && isNaN(parseFloat(args[1])) ||
            args.length == 1 && isNaN(parseFloat(args[0]))) {
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
            let parsed: string | undefined;
            let amount = 0;
            let name = 'Gryffindor 🦁';
            let messageToSent: any;

            if (args.length == 2) {
                parsed = args.shift();
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

                amount = parseFloat(parsed);
                house = house.toLowerCase();


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

                messageToSent = {
                    content: `Dumbly awards ${name} **${amount} points!**\n`,
                    files: [new MessageAttachment(Configs.emoji_dumbly)]
                }
            }
            else {

                parsed = args.shift();
                if (!parsed) {
                    logger.log('error', 'Error shifting the amount.');
                    return;
                }
                amount = parseFloat(parsed);
                let messageCommands = message.content.slice(Configs.command_prefix.length).split(/ +/);
                const house = messageCommands[1];

                switch (house) {
                    case "🦁":
                        points.gryffindor += amount;
                        break;
                    case "🐍":
                        points.slytherin += amount;
                        name = 'Slytherin 🐍';
                        break;
                    case "🦅":
                        points.ravenclaw += amount;
                        name = 'Ravenclaw 🦅';
                        break;
                    case "🦡":
                        points.hufflepuff += amount;
                        name = 'Hufflepuff 🦡';
                        break;

                }

                messageToSent = {
                    content: `**${amount} points** ${amount > 0 ? 'to' : 'from'} ${name}!!`
                };

            }

            stat.points = points;

            stat
                .save()
                .then(() => {
                    message.channel
                        .send({
                            content: messageToSent.content,
                            files: messageToSent.files
                        })
                        .catch(err => logger.log('error', err));
                })
                .catch(err => logger.log('error', err));
            logger.log('info', `${messageToSent.conten}`);

            printPoints(hourglass_channel, points, logger, true);
        })
            .catch(err => logger.log('error', err));
    }
};

export default new Dumbly();