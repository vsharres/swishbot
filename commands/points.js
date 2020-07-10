const Stat = require('../models/Stat');
const { stats_id } = require('../config/configs');

module.exports = {
    name: "points",
    description: '',
    cooldown: 10,
    usage: '',
    args: false,
    execute(message, arg, logger) {

        Stat.findById(stats_id).then(stat => {

            const points = stat.points[stat.points.length - 1];
            const gryf = points.gryffindor;
            const slyth = points.slytherin;
            const raven = points.ravenclaw;
            const huff = points.hufflepuff;

            let sortedPoints = [{
                house: `Gryffindor 🦁`,
                points: gryf
            },
            {
                house: `Slytherin 🐍`,
                points: slyth
            },
            {
                house: `Ravenclaw 🦅`,
                points: raven
            },
            {
                house: `Hufflepuff 🦡`,
                points: huff
            }
            ];

            sortedPoints.sort((a, b) => b.points - a.points);
            let reply = 'This is the current tally of house points:\n\n';

            //Check if any house is tied
            if (gryf === slyth || gryf === raven || gryf === huff || slyth === raven || slyth === huff || raven === huff) {

                //for the case when all houses are tied
                if (gryf === slyth && slyth === raven && raven === huff) {

                    reply += `All houses are tied with **${gryf} points!**`;
                    return message.channel.send(reply);

                }
                //for the case with 3 houses tied
                else if ((gryf === slyth && slyth === raven) || (gryf === slyth && slyth === huff) || (gryf === raven && raven === huff) || (slyth === raven && raven === huff)) {
                    if (sortedPoints[0] === sortedPoints[1]) {
                        reply += `${sortedPoints[0].house}, ${sortedPoints[1].house}, ${sortedPoints[2].house} are tied in first place with **${sortedPoints[0].points} points!**\n`;
                        reply += `${sortedPoints[3].house} is in second place with **${sortedPoints[3].points} points!**\n`;
                    }
                    else {
                        reply += `${sortedPoints[0].house} is in first place with **${sortedPoints[0].points} points!**\n`;
                        reply += `${sortedPoints[1].house}, ${sortedPoints[2].house}, ${sortedPoints[3].house} are tied in second place with **${sortedPoints[1].points} points!**\n`;
                    }

                    return message.channel.send(reply);
                }
                //for the case where only two houses are tied
                else {
                    if (sortedPoints[0] === sortedPoints[1]) {
                        reply += `${sortedPoints[0].house}, ${sortedPoints[1].house} are tied in first place with **${sortedPoints[0].points} points!**\n`;
                        reply += `${sortedPoints[2].house} is in second place with **${sortedPoints[2].points} points!**\n`;
                        reply += `${sortedPoints[3].house} is in third place with **${sortedPoints[3].points} points!**\n`;

                        return message.channel.send(reply);
                    }
                    else if (sortedPoints[1] === sortedPoints[2]) {
                        reply += `${sortedPoints[0].house} is in first place with **${sortedPoints[0].points} points!**\n`;
                        reply += `${sortedPoints[1].house}, ${sortedPoints[2].house} are tied in second place with **${sortedPoints[1].points} points!**\n`;
                        reply += `${sortedPoints[3].house} is in third place with **${sortedPoints[3].points} points!**\n`;

                        return message.channel.send(reply);
                    }
                    else {
                        reply += `${sortedPoints[0].house} is in first place with **${sortedPoints[0].points} points!**\n`;
                        reply += `${sortedPoints[1].house} is in second place with **${sortedPoints[1].points} points!**\n`;
                        reply += `${sortedPoints[2].house}, ${sortedPoints[3].house} are tied in third place with **${sortedPoints[2].points} points!**\n`;

                        return message.channel.send(reply);
                    }
                }
            }
            else {

                for (let index = 0; index < sortedPoints.length; index++) {
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
                    reply += `${sortedPoints[index].house} is in ${placement} place with **${sortedPoints[index].points} points!**\n`;

                }
                return message.channel.send(reply);

            }

        })
            .catch(err => logger.log('error', err));
    },
};