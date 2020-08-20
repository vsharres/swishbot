import { Configs } from '../config/configs';
import { Message, TextChannel } from 'discord.js'
import { Logger } from 'winston';

async function printPoints(message: Message, points: any, logger: Logger) {
    //Delete the previous message
    if (Configs.house_points_channel !== undefined && message.guild) {
        const hourglass_channel = <TextChannel>message.guild.channels.cache.get(Configs.house_points_channel);

        if (hourglass_channel) {
            hourglass_channel.bulkDelete(4)
                .then(messages => {
                    logger.log('info', `Bulk deleted ${messages.size} messages`);
                })
                .catch(error => { return logger.log('error', error) });
        }
        else {
            return logger.log('error', 'Couldn\'t find the hourglass channel, check Id');
        }

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

        const gryf = houses[0].points;
        const slyth = houses[1].points;
        const raven = houses[2].points;
        const huff = houses[3].points;

        houses.sort((a, b) => b.points - a.points);
        let reply = '**House Points**\n\n';

        //Check if any house is tied
        if (gryf === slyth || gryf === raven || gryf === huff || slyth === raven || slyth === huff || raven === huff) {

            //for the case when all houses are tied
            if (gryf === slyth && slyth === raven && raven === huff) {

                reply += `All houses are tied with **${gryf} points!**`;
                return hourglass_channel.send(reply)
                    .catch(error => logger.log('error', error));

            }
            //for the case with 3 houses tied
            else if ((gryf === slyth && slyth === raven) || (gryf === slyth && slyth === huff) || (gryf === raven && raven === huff) || (slyth === raven && raven === huff)) {
                if (houses[0] === houses[1]) {
                    reply += `${houses[0].house}, ${houses[1].house}, ${houses[2].house} are tied in first place with **${houses[0].points} points!**\n\n`;
                    reply += `${houses[3].house} is in second place with **${houses[3].points} points!**\n`;
                }
                else {
                    reply += `${houses[0].house} is in first place with **${houses[0].points} points!**\n`;
                    reply += `${houses[1].house}, ${houses[2].house}, ${houses[3].house} are tied in second place with **${houses[1].points} points!**\n\n`;
                }

                return hourglass_channel.send(reply)
                    .catch(error => logger.log('error', error));
            }
            //for the case where only two houses are tied
            else {
                if (houses[0] === houses[1] && houses[2] === houses[3]) {
                    reply += `${houses[0].house}, ${houses[1].house} are tied in first place with **${houses[0].points} points!**\n`;
                    reply += `${houses[2].house}, ${houses[3].house} are tied in second place with **${houses[2].points} points!**\n`;

                    return hourglass_channel.send(reply)
                        .catch(error => logger.log('error', error));
                }
                else if (houses[0] === houses[1]) {
                    reply += `${houses[0].house}, ${houses[1].house} are tied in first place with **${houses[0].points} points!**\n`;
                    reply += `${houses[2].house} is in second place with **${houses[2].points} points!**\n`;
                    reply += `${houses[3].house} is in third place with **${houses[3].points} points!**\n\n`;

                    return hourglass_channel.send(reply)
                        .catch(error => logger.log('error', error));
                }
                else if (houses[1] === houses[2]) {
                    reply += `${houses[0].house} is in first place with **${houses[0].points} points!**\n`;
                    reply += `${houses[1].house}, ${houses[2].house} are tied in second place with **${houses[1].points} points!**\n`;
                    reply += `${houses[3].house} is in third place with **${houses[3].points} points!**\n\n`;

                    return hourglass_channel.send(reply)
                        .catch(error => logger.log('error', error));
                }
                else {
                    reply += `${houses[0].house} is in first place with **${houses[0].points} points!**\n`;
                    reply += `${houses[1].house} is in second place with **${houses[1].points} points!**\n`;
                    reply += `${houses[2].house}, ${houses[3].house} are tied in third place with **${houses[2].points} points!**\n\n`;

                    return hourglass_channel.send(reply)
                        .catch(error => logger.log('error', error));
                }
            }
        }
        else {

            for (let index = 0; index < houses.length; index++) {
                let placement = '';
                switch (index) {
                    case 0:
                        placement = 'first';
                        break;
                    case 1:
                        placement = 'second';
                        break;
                    case 2:
                        placement = 'third';
                        break;
                    case 3:
                        placement = 'fourth';
                        break;
                    default:
                        break;
                }
                reply += `${houses[index].house} is in ${placement} place with **${houses[index].points} points!**\n`;

            }
            reply += '\n';
            return hourglass_channel.send(reply)
                .catch(error => logger.log('error', error));

        }
    }



}

export { printPoints }