import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message, TextChannel, Client } from 'discord.js';
import { printPoints } from '../tools/print_points';
import logger from '../tools/logger';
import { Command } from './command';

export class Dumbly extends Command {

    hourglass_channel: TextChannel;

    constructor(client: Client) {
        super(client, ["dumbly", "dumbledore", "🦁", "🐍", "🦅", "🦡", "gryffindor", "ravenclaw", "hufflepuff", "slytherin"], true, false, true);

        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
    }

    async execute(message: Message, args: string[]) {

        if (args.length == 2 && isNaN(parseFloat(args[1])) ||
            args.length == 1 && isNaN(parseFloat(args[0]))) {
            return;
        }

        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                logger.log('error', `[${this.names[0]}]: Error to get the stats, check the id`);
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
                    logger.log('error', `[${this.names[0]}]: Error shifting the house.`);
                    return;
                }
                let house = parsed;

                parsed = args.shift();
                if (!parsed) {
                    logger.log('error', `[${this.names[0]}]: Error shifting the amount.`);
                    return;
                }

                amount = parseFloat(parsed);
                house = house.toLowerCase();

                switch (house) {
                    case 'gryffindor':
                        points.gryffindor += amount * Configs.gryffindor_points_multiplier;
                        break;
                    case "🦁":
                        points.gryffindor += amount * Configs.gryffindor_points_multiplier;
                        break;
                    case 'slytherin':
                        points.slytherin += amount * Configs.slytherin_points_multiplier;
                        name = 'Slytherin 🐍';
                        break;
                    case '🐍':
                        points.slytherin += amount * Configs.slytherin_points_multiplier;
                        name = 'Slytherin 🐍';
                        break;
                    case 'ravenclaw':
                        points.ravenclaw += amount * Configs.ravenclaw_points_multiplier;
                        name = 'Ravenclaw 🦅';
                        break;
                    case '🦅':
                        points.ravenclaw += amount * Configs.ravenclaw_points_multiplier;
                        name = 'Ravenclaw 🦅';
                        break;
                    case 'hufflepuff':
                        points.hufflepuff += amount * Configs.hufflepuff_points_multiplier;
                        name = 'Hufflepuff 🦡';
                        break;
                    case '🦡':
                        points.hufflepuff += amount * Configs.hufflepuff_points_multiplier;
                        name = 'Hufflepuff 🦡';
                        break;
                    default:
                        logger.log('error', `[${this.names[0]}]: Error parsing the house from the arguments`);
                        return;
                }

                messageToSent = {
                    content: `${amount} points** ${amount > 0 ? 'to' : 'from'} ${name}!!`
                }
            }
            else {

                parsed = args.shift();
                if (!parsed) {
                    logger.log('error', `[${this.names[0]}]: Error shifting the amount.`);
                    return;
                }
                amount = parseFloat(parsed);
                const messageCommands = message.content.slice(Configs.command_prefix.length).split(/ +/);
                const house = messageCommands[1].toLowerCase();

                switch (house) {
                    case "🦁":
                        points.gryffindor += amount * Configs.gryffindor_points_multiplier;
                        break;
                    case "gryffindor":
                        points.gryffindor += amount * Configs.gryffindor_points_multiplier;
                        break;
                    case "🐍":
                        points.slytherin += amount * Configs.slytherin_points_multiplier;
                        name = 'Slytherin 🐍';
                        break;
                    case "slytherin":
                        points.slytherin += amount * Configs.slytherin_points_multiplier;
                        name = 'Slytherin 🐍';
                        break;
                    case "🦅":
                        points.ravenclaw += amount * Configs.ravenclaw_points_multiplier;
                        name = 'Ravenclaw 🦅';
                        break;
                    case "ravenclaw":
                        points.ravenclaw += amount * Configs.ravenclaw_points_multiplier;
                        name = 'Ravenclaw 🦅';
                        break;
                    case "hufflepuff":
                        points.hufflepuff += amount * Configs.hufflepuff_points_multiplier;
                        name = 'Hufflepuff 🦡';
                        break;
                    case "🦡":
                        points.hufflepuff += amount * Configs.hufflepuff_points_multiplier;
                        name = 'Hufflepuff 🦡';
                        break;

                }

                messageToSent = {
                    content: `**${amount} points** ${amount > 0 ? 'to' : 'from'} ${name}!!`
                };

            }

           //stat.points = points;
            stat.points.gryffindor = points.gryffindor;
            stat.points.hufflepuff = points.hufflepuff;
            stat.points.slytherin = points.slytherin;
            stat.points.ravenclaw = points.ravenclaw;

            stat
                .save()
                .then(() => {
                    message.channel
                        .send({
                            content: messageToSent.content,
                            files: messageToSent.files
                        })
                        .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
                })
                .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
            logger.log('info', `[${this.names[0]}]: ${messageToSent.content}`);

            printPoints(this.hourglass_channel, points, true);
        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Dumbly(client); }