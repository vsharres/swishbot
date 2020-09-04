import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { printPoints } from '../tools/print_points';
import { Message } from 'discord.js';
import { Logger } from 'winston';
import { Command } from './command';

export class PointsReset extends Command {

    constructor() {
        super("points_reset", '', 10, '', false, true);
    }

    async execute(message: Message, arg: string[], logger: Logger) {

        Stat.findById(Configs.stats_id).then(stat => {
            if (!stat)
                return;

            const points = stat.points[stat.points.length - 1];

            let cups = [
                { name: 'Gryffindor', points: points.gryffindor },
                { name: 'Slytherin', points: points.slytherin },
                { name: 'Hufflepuff', points: points.ravenclaw },
                { name: 'Ravenclaw', points: points.hufflepuff }
            ];

            cups.sort((a, b) => b.points - a.points);
            if (cups[0].points !== cups[1].points) {
                let new_cup = stat.house_cups;

                switch (cups[0].name) {
                    case 'Gryffindor':
                        new_cup.gryffindor++;
                        break;
                    case 'Slytherin':
                        new_cup.slytherin++;
                        break;
                    case 'Hufflepuff':
                        new_cup.hufflepuff++;
                        break;
                    case 'Ravenclaw':
                        new_cup.ravenclaw++;
                        break;

                }
                stat.house_cups = new_cup;
            }
            else {
                logger.log('warn', `There was a tie between ${cups[0].name} and ${cups[1].name}`);
            }

            stat.points.push({
                gryffindor: 0,
                slytherin: 0,
                ravenclaw: 0,
                hufflepuff: 0
            });

            printPoints(message, stat.points[stat.points.length - 1], logger);

            stat
                .save()
                .then(() => {
                    logger.log('info', `A new year has begun! All house points are reset.`);
                })
                .catch(err => logger.log('error', err));

        })
            .catch(err => logger.log('error', err));
    }
};

export default new PointsReset();