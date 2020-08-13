const Stat = require('../models/Stat');
const config = require('../config/configs');
const { MessageAttachment } = require('discord.js');
const printer = require('../tools/print_points');

module.exports = {
    name: "dumbly",
    description: '',
    cooldown: 10,
    usage: '<house> <amount>',
    args: true,
    head_pupil: true,
    execute(message, args, logger) {

        if (args.length !== 2 && !isNaN(args[0])) {
            return message.channel.send(`${message.author} the proper usage would be: ${config.command_prefix} \`${this.name} ${this.usage}\``);
        }

        Stat.findById(config.stats_id).then(stat => {

            let points = stat.points[stat.points.length - 1];
            const amount = parseFloat(args.shift());
            let house = args.shift();
            house = house.toLowerCase();
            let name = 'Gryffindor 🦁';

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

            stat.points[stat.points.length - 1] = points;

            stat
                .save()
                .then(() => {
                    message.channel
                        .send({
                            content: `Dumbly awards ${name} with **${amount} points!**\n`,
                            files: [new MessageAttachment(config.dumbly_emoji)]
                        })
                        .catch(err => logger.log('error', err));
                })
                .catch(err => logger.log('error', err));

            printer.printPoints(message, points, logger);
        })
            .catch(err => logger.log('error', err));
    },
};