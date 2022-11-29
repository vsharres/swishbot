import { Client, Events, Message, TextChannel } from 'discord.js';
import logger from '../tools/logger';
import { BotEvent } from '../bot-types';
import Stat from '../models/Stat';
import { Configs } from '../config/configs';
import { addPointsToHouse } from '../tools/add_points';
import { printPoints } from '../tools/print_points';

export class Felix extends BotEvent {

    hourglass_channel: TextChannel;

    constructor(client: Client) {
        super(client, 'felix', Events.MessageCreate, true);

        this.hourglass_channel = client.channels.cache.get(Configs.channel_house_points) as TextChannel;
    }

    async execute(message: Message) {

        if (message.author.bot) return;
        if (message.channel.id !== Configs.channel_recording) return;

        const chance_slytherin = Math.random() * 100;
        const chance_ravenclaw = Math.random() * 100;
        const chance_gryffindor = Math.random() * 100;
        const chance_hufflepuff = Math.random() * 100;

        let change_slytherin = false;
        let change_ravenclaw = false;
        let change_gryffindor = false;
        let change_hufflepuff = false;
        let log_message = '';


        if (chance_slytherin < Configs.slytherin_felix_chance) {
            change_slytherin = true;
        }

        if (chance_ravenclaw < Configs.ravenclaw_felix_chance) {
            change_ravenclaw = true;
        }

        if (chance_gryffindor < Configs.gryffindor_felix_chance) {
            change_gryffindor = true;
        }

        if (chance_hufflepuff < Configs.hufflepuff_felix_chance) {
            change_hufflepuff = true;
        }

        if (!change_slytherin && !change_ravenclaw && !change_gryffindor && !change_hufflepuff) {
            return;
        }

        Stat.findById(Configs.stats_id).then((stat) => {

            if (!stat) {
                return;
            }

            if (change_slytherin) {
                const points = addPointsToHouse(Configs.points_likes, stat.points, Configs.role_slytherin);
                stat.points.gryffindor = points.gryffindor;
                stat.points.hufflepuff = points.hufflepuff;
                stat.points.slytherin = points.slytherin;
                stat.points.ravenclaw = points.ravenclaw;
                log_message = `Felix points added to Slytherin 😈`;
            }

            if (change_ravenclaw) {
                const points = addPointsToHouse(Configs.points_likes, stat.points, Configs.role_ravenclaw);
                stat.points.gryffindor = points.gryffindor;
                stat.points.hufflepuff = points.hufflepuff;
                stat.points.slytherin = points.slytherin;
                stat.points.ravenclaw = points.ravenclaw;
                log_message = `Felix points added to Ravenclaw 😈`;
            }

            if (change_hufflepuff) {
                const points = addPointsToHouse(Configs.points_likes, stat.points, Configs.role_hufflepuff);
                stat.points.gryffindor = points.gryffindor;
                stat.points.hufflepuff = points.hufflepuff;
                stat.points.slytherin = points.slytherin;
                stat.points.ravenclaw = points.ravenclaw;
                log_message = `Felix points added to Hufflepuff 😈`;
            }

            if (change_gryffindor) {
                const points = addPointsToHouse(Configs.points_likes, stat.points, Configs.role_gryffindor);
                stat.points.gryffindor = points.gryffindor;
                stat.points.hufflepuff = points.hufflepuff;
                stat.points.slytherin = points.slytherin;
                stat.points.ravenclaw = points.ravenclaw;
                log_message = `Felix points added to Gryffindor 😈`;
            }

            printPoints(this.hourglass_channel, stat.points, true);

            stat
                .save()
                .then(() => {
                    logger.log('info', `[${this.name}]: ${log_message}`);

                })
                .catch(err => logger.log('error', `[${this.name}]: ${err}`));



        }).catch(err => logger.log('error', `[${this.name}]: ${err}`));

    }

};

module.exports = (client: Client) => {
    return new Felix(client);
}