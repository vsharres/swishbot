import { TextChannel } from 'discord.js'
import logger from './logger';
import { Houses } from '../models/Stat';

async function printPoints(channel: TextChannel, points: Houses, is_print_channel: boolean = false) {

    let houses = [{
        house: 'Gryffindor 🦁',
        points: points.gryffindor
    },
    {
        house: 'Slytherin 🐍',
        points: points.slytherin
    },
    {
        house: 'Ravenclaw 🦅',
        points: points.ravenclaw
    },
    {
        house: 'Hufflepuff 🦡',
        points: points.hufflepuff
    }
    ];

    const gryf_points = houses[0].points;
    const slyth_points = houses[1].points;
    const raven_points = houses[2].points;
    const huff_points = houses[3].points;

    houses.sort((a, b) => b.points - a.points);
    let reply = '**House Points**\n\n';

    //Check if any house are tied
    if (gryf_points === slyth_points || gryf_points === raven_points || gryf_points === huff_points || slyth_points === raven_points || slyth_points === huff_points || raven_points === huff_points) {

        //for the case when all houses are tied
        if (gryf_points === slyth_points && slyth_points === raven_points && raven_points === huff_points) {

            reply += `All houses are tied with **${gryf_points} point${gryf_points === 1 ? '' : 's'}!**\n`;

        }
        //for the case with 3 houses tied
        else if ((gryf_points === slyth_points && slyth_points === raven_points) ||
            (gryf_points === slyth_points && slyth_points === huff_points) ||
            (gryf_points === raven_points && raven_points === huff_points) ||
            (slyth_points === raven_points && raven_points === huff_points)) {
            if (houses[0].points === houses[1].points && houses[1].points === houses[2].points) {
                reply += `${houses[0].house}, ${houses[1].house}, ${houses[2].house} are tied in first place with **${houses[0].points} point${houses[0].points === 1 ? '' : 's'}!**\n`;
                reply += `${houses[3].house} is in second place with **${houses[3].points} point${houses[3].points === 1 ? '' : 's'}!**\n\n`;

            }
            else {
                reply += `${houses[0].house} is in first place with **${houses[0].points} point${houses[0].points === 1 ? '' : 's'}!**\n`;
                reply += `${houses[1].house}, ${houses[2].house}, ${houses[3].house} are tied in second place with **${houses[1].points} point${houses[1].points === 1 ? '' : 's'}!**\n\n`;
            }
        }
        //for the case where only two houses are tied
        else {
            if (houses[0].points === houses[1].points && houses[2].points === houses[3].points) {
                reply += `${houses[0].house}, ${houses[1].house} are tied in first place with **${houses[0].points} point${houses[0].points === 1 ? '' : 's'}!**\n`;
                reply += `${houses[2].house}, ${houses[3].house} are tied in second place with **${houses[2].points} point${houses[2].points === 1 ? '' : 's'}!**\n\n`;
            }
            else if (houses[0].points === houses[1].points && houses[1].points !== houses[2].points && houses[1].points !== houses[3].points) {
                reply += `${houses[0].house}, ${houses[1].house} are tied in first place with **${houses[0].points} point${houses[0].points === 1 ? '' : 's'}!**\n`;
                reply += `${houses[2].house} is in second place with **${houses[2].points} point${houses[2].points === 1 ? '' : 's'}!**\n`;
                reply += `${houses[3].house} is in third place with **${houses[3].points} point${houses[3].points === 1 ? '' : 's'}!**\n\n`;
            }
            else if (houses[0].points !== houses[1].points && houses[1].points === houses[2].points && houses[2].points !== houses[3].points) {
                reply += `${houses[0].house} is in first place with **${houses[0].points} point${houses[0].points === 1 ? '' : 's'}!**\n`;
                reply += `${houses[1].house}, ${houses[2].house} are tied in second place with **${houses[1].points} point${houses[1].points === 1 ? '' : 's'}!**\n`;
                reply += `${houses[3].house} is in third place with **${houses[3].points} point${houses[3].points === 1 ? '' : 's'}!**\n\n`;
            }
            else {
                reply += `${houses[0].house} is in first place with **${houses[0].points} point${houses[0].points === 1 ? '' : 's'}!**\n`;
                reply += `${houses[1].house} is in second place with **${houses[1].points} point${houses[1].points === 1 ? '' : 's'}!**\n`;
                reply += `${houses[2].house}, ${houses[3].house} are tied in third place with **${houses[2].points} point${houses[2].points === 1 ? '' : 's'}!**\n\n`;
            }
        }
    }
    else {
        reply += `${houses[0].house} is in first place with **${houses[0].points} point${houses[0].points === 1 ? '' : 's'}!**\n`;
        reply += `${houses[1].house} is in second place with **${houses[1].points} point${houses[1].points === 1 ? '' : 's'}!**\n`;
        reply += `${houses[2].house} is in third place with **${houses[2].points} point${houses[2].points === 1 ? '' : 's'}!**\n`;
        reply += `${houses[3].house} is in fourth place with **${houses[3].points} point${houses[3].points === 1 ? '' : 's'}!**\n\n`;

    }

    if (is_print_channel) {

        const messages = await channel.messages.fetch();
        const message = messages.first();
        if (message) {
            message.edit(reply)
                .catch(error => logger.log('error', error));
        }
        else {
            channel.send(reply)
                .catch(error => logger.log('error', error));
        }

    }
    else {
        channel.send(reply)
            .catch(error => logger.log('error', error));
    }

}

export { printPoints }