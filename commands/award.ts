import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Client, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { Command } from './command';
import { printcups } from '../tools/print_cups';

export class Award extends Command {

    trophy_channel: TextChannel;

    constructor(client: Client) {
        super(client, ["award_cup", "winner"], true, false, true);

        this.trophy_channel = client.channels.cache.get(Configs.channel_trophy_room) as TextChannel;
    }

    async execute(message: Message, args: string[],) {

        if (args.length !== 1 || !isNaN(parseFloat(args[0]))) {
            logger.log('error', `[${this.names[0]}]: Incorrect usage.`);
            return;
        }

        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                logger.log('error', `[${this.names[0]}]: Error to get the stats, check the id`);
                return;
            }

            let house = args.shift();
            if (!house) {
                logger.log('error', `[${this.names[0]}]: Error shifting the house.`);
                return;
            }
            house = house.toLowerCase();

            let name = 'Gryffindor 🦁';
            let cups = stat.house_cups;

            switch (house) {
                case 'gryffindor':
                    cups.gryffindor++;
                    break;
                case '🦁':
                    cups.gryffindor++;
                    break;
                case 'slytherin':
                    cups.slytherin++;
                    name = 'Slytherin 🐍';
                    break;
                case '🐍':
                    cups.slytherin++;
                    name = 'Slytherin 🐍';
                    break;
                case '🦅':
                    cups.ravenclaw++;
                    name = 'Ravenclaw 🦅';
                    break;
                case 'ravenclaw':
                    cups.ravenclaw++;
                    name = 'Ravenclaw 🦅';
                    break;
                case 'hufflepuff':
                    cups.hufflepuff++;
                    name = 'Hufflepuff 🦡';
                    break;
                case '🦡':
                    cups.hufflepuff++;
                    name = 'Hufflepuff 🦡';
                    break;
                default:
                    logger.log('error', `[${this.names[0]}]: Incorrect usage.`);
                    return;
            }

            stat.house_cups = cups;

            printcups(this.trophy_channel, cups, true);

            stat
                .save()
                .then(() => {
                    message.channel
                        .send(`The house cup for this recording goes to **${name}!** \n`)
                        .then(() => logger.log('info', `[${this.names[0]}]: The house cup for this recording goes to **${name}!** \n`))
                        .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
                })
                .catch(err => logger.log('error', err));



        })
            .catch(err => logger.log('error', `[${this.names[0]}]: ${err}`));
    }
};

export default (client: Client) => { return new Award(client); }