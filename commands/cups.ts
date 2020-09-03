import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { Message } from 'discord.js';
import { Logger } from 'winston';
import { Command } from './command';

export class Cups extends Command {

    constructor() {
        super("cups", '', 10, '');
    }

    async execute(message: Message, arg: string[], logger: Logger) {

        const start_time = Date.now();

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat) {
                return logger.log('error', 'Error getting the stat, check the stat id');
            }

            const cups = stat.house_cups;

            let reply = '**House Cups**\n\n';

            let sorted_cups = [{
                house: 'Gryffindor 🦁',
                value: cups.gryffindor
            }, {
                house: 'Slytherin 🐍',
                value: cups.slytherin
            },
            {
                house: 'Ravenclaw 🦅',
                value: cups.ravenclaw
            },
            {
                house: 'Hufflepuff 🦡',
                value: cups.hufflepuff
            }];

            const gryf_cups = sorted_cups[0].value;
            const slyth_cups = sorted_cups[1].value;
            const raven_cups = sorted_cups[2].value;
            const huff_cups = sorted_cups[3].value;

            sorted_cups.sort((a, b) => b.value - a.value);

            //Check if any house is tied
            if (gryf_cups === slyth_cups || gryf_cups === raven_cups || gryf_cups === huff_cups || slyth_cups === raven_cups || slyth_cups === huff_cups || raven_cups === huff_cups) {

                //for the case when all houses are tied
                if (gryf_cups === slyth_cups && slyth_cups === raven_cups && raven_cups === huff_cups) {

                    reply += `All houses are tied with **${gryf_cups} cups**\n\n`;

                }
                //for the case with 3 houses tied
                else if ((gryf_cups === slyth_cups && slyth_cups === raven_cups) || (gryf_cups === slyth_cups && slyth_cups === huff_cups) || (gryf_cups === raven_cups && raven_cups === huff_cups) || (slyth_cups === raven_cups && raven_cups === huff_cups)) {
                    if (sorted_cups[0].value === sorted_cups[1].value && sorted_cups[1].value === sorted_cups[2].value) {
                        reply += `${sorted_cups[0].house}, ${sorted_cups[1].house}, ${sorted_cups[2].house} are tied in first place with **${sorted_cups[0].value} cups!**\n`;
                        reply += `${sorted_cups[3].house} is in second place with **${sorted_cups[3].value} cups**\n\n`;
                    }
                    else {
                        reply += `${sorted_cups[0].house} is in first place with **${sorted_cups[0].value} cups!**\n`;
                        reply += `${sorted_cups[1].house}, ${sorted_cups[2].house}, ${sorted_cups[3].house} are tied in second place with **${sorted_cups[1].value} cups**\n\n`;
                    }
                }
                //for the case where only two sorted_cups are tied
                else {
                    if (sorted_cups[0].value === sorted_cups[1].value && sorted_cups[2].value === sorted_cups[3].value) {
                        reply += `${sorted_cups[0].house}, ${sorted_cups[1].house} are tied in first place with **${sorted_cups[0].value} cups!**\n`;
                        reply += `${sorted_cups[2].house}, ${sorted_cups[3].house} are tied in second place with **${sorted_cups[2].value} cups**\n\n`;
                    }
                    else if (sorted_cups[0].value === sorted_cups[1].value && sorted_cups[1].value !== sorted_cups[2].value && sorted_cups[1].value !== sorted_cups[3].value) {
                        reply += `${sorted_cups[0].house}, ${sorted_cups[1].house} are tied in first place with **${sorted_cups[0].value} cups!**\n`;
                        reply += `${sorted_cups[2].house} is in second place with **${sorted_cups[2].value} cups**\n`;
                        reply += `${sorted_cups[3].house} is in third place with **${sorted_cups[3].value} cups**\n\n`;
                    }
                    else if (sorted_cups[0].value !== sorted_cups[1].value && sorted_cups[1].value === sorted_cups[2].value && sorted_cups[2].value !== sorted_cups[3].value) {
                        reply += `${sorted_cups[0].house} is in first place with **${sorted_cups[0].value} cups!**\n`;
                        reply += `${sorted_cups[1].house}, ${sorted_cups[2].house} are tied in second place with **${sorted_cups[1].value} cups**\n`;
                        reply += `${sorted_cups[3].house} is in third place with **${sorted_cups[3].value} cups**\n\n`;
                    }
                    else {
                        reply += `${sorted_cups[0].house} is in first place with **${sorted_cups[0].value} cups!**\n`;
                        reply += `${sorted_cups[1].house} is in second place with **${sorted_cups[1].value} cups**\n`;
                        reply += `${sorted_cups[2].house}, ${sorted_cups[3].house} are tied in third place with **${sorted_cups[2].value} cups**\n\n`;
                    }
                }
            }
            else {

                reply += `${sorted_cups[0].house} is in first place with **${sorted_cups[0].value} cups!**\n`;
                reply += `${sorted_cups[1].house} is in second place with **${sorted_cups[1].value} cups!**\n`;
                reply += `${sorted_cups[2].house} is in third place with **${sorted_cups[2].value} cups!**\n`;
                reply += `${sorted_cups[3].house} is in fourth place with **${sorted_cups[3].value} cups!**\n`;
                reply += '\n\n';

            }

            return message.channel.send(reply)
                .then(() => {
                    const end_time = Date.now();
                    logger.log('info', `Time to execute: ${end_time - start_time} ms`);
                })
                .catch(error => logger.log('error', error));



        })
            .catch(err => logger.log('error', err));
    }
};

export default new Cups();